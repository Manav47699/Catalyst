"use client";

import { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import Chatbot from "../../components/Chatbot";

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('seeking-mentors');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    seeking_for: "",
    mentorship_until: "",
    website: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'feed', label: 'Feed', route: '/posts' },
    { id: 'groups', label: 'Groups', route: '/groups' },
    { id: 'catalyst-partners', label: 'Catalyst Partners', route: '/catalytic_partners' },
    { id: 'seeking-mentors', label: 'Seeking Mentors?', route: '/payments' },
    { id: 'discover-startups', label: 'Discover Startups', route: '/capital' },
    { id: 'ai-guidance', label: 'AI Guidance', route: '/smart_chat' }
  ];

  useEffect(() => {
    fetch("http://localhost:8000/doctors/mentors/")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching mentors: ${text}`);
        }
        return res.json();
      })
      .then((data) => setMentors(data))
      .catch((err) => console.error(err));

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMakeRequest = (mentor) => {
    setSelectedMentor(mentor);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setSelectedMentor(null);
    setFormData({
      company_name: "",
      seeking_for: "",
      mentorship_until: "",
      website: "",
      linkedin: "",
    });
  };

  const handleSubmit = async () => {
    if (!selectedMentor) {
      alert("Please select a mentor first!");
      return;
    }

    if (!formData.company_name || !formData.seeking_for || !formData.mentorship_until) {
      alert("Please fill in all required fields (company name, seeking for, duration)");
      return;
    }

    setLoading(true);

    try {
      const createRes = await fetch(
        `http://localhost:8000/doctors/mentors/${selectedMentor.id}/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const createData = await createRes.json();
      const mentorRequestId = createData.mentor_request_id;

      const checkoutRes = await fetch(
        "http://localhost:8000/doctors/stripe/create-checkout-session/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentor_request_id: mentorRequestId }),
        }
      );
      const checkoutData = await checkoutRes.json();

      window.location.href = checkoutData.checkout_url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/posts";
  };

  const handleBack = () => window.history.back();

  const navigateToTab = (route) => {
    window.location.href = route;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-green-50">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b-4 border-green-400">
          <div className="max-w-4xl mx-auto px-6 py-8 text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 flex justify-start">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                  ← Back
                </button>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Book Your Mentorship
              </h1>
              <div className="flex-1 flex justify-end">
                {user && (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-green-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-lg">
              Connect with experienced mentors for guidance
            </p>
          </div>
        </div>

        {/* Centered Navigation Tabs */}
        <div className="bg-white/90 backdrop-blur-md shadow-xl mt-2 border-y-2 border-green-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center items-center gap-3 p-5 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateToTab(tab.route)}
                  className={`
                    px-8 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium shadow-md
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl scale-110 shadow-green-300' 
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 hover:scale-105'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mentors List */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-green-200"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={mentor.profilepic || "/default-doctor.jpg"}
                      alt={mentor.name}
                      onClick={() => setExpandedImage(mentor.profilepic || "/default-doctor.jpg")}
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-300 cursor-pointer hover:border-green-500 transition-all hover:scale-105"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-600 mb-1">{mentor.name}</h3>
                      <p className="text-gray-700 text-sm mb-2">{mentor.expertise}</p>
                      <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold text-sm">
                        ${mentor.fees || 50} consultation fee
                      </div>
                      <p className="text-gray-600 mt-2 text-sm">Available: {mentor.available_time}</p>
                    </div>
                  </div>

                  {/* Certificates */}
                  {mentor.certificates && mentor.certificates.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Certifications</p>
                      <div className="flex gap-3 flex-wrap">
                        {mentor.certificates.map((certUrl, idx) => (
                          <img
                            key={idx}
                            src={certUrl}
                            alt={`Certificate ${idx + 1}`}
                            onClick={() => setExpandedImage(certUrl)}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-green-200 cursor-pointer hover:border-green-400 transition-all hover:scale-105 shadow-md"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleMakeRequest(mentor)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-lime-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Book Mentorship
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentor Request Form Modal */}
      {formVisible && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Book Mentorship</h2>
                <p className="text-green-100 text-sm mt-1">with {selectedMentor.name}</p>
              </div>
              <button onClick={closeForm} className="text-white hover:bg-green-600 rounded-full p-2 transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all text-gray-900"
                />
              </div>

              {/* Seeking For */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">What you are seeking in a mentor</label>
                <input
                  type="text"
                  name="seeking_for"
                  value={formData.seeking_for}
                  onChange={handleChange}
                  placeholder="e.g. Technical guidance, business strategy"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all text-gray-900"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (e.g. 3 months)</label>
                <input
                  type="text"
                  name="mentorship_until"
                  value={formData.mentorship_until}
                  onChange={handleChange}
                  placeholder="How long do you want to hire?"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all text-gray-900"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website (Optional)</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Company website"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all text-gray-900"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn (Optional)</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn profile"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-all text-gray-900"
                />
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeForm}
                  className="flex-1 px-6 py-3 border-2 border-green-300 text-green-900 font-semibold rounded-xl hover:bg-green-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-lime-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : (
                    <span className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" /> Book & Pay ${selectedMentor?.fees || 50}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-green-400 transition-all"
            >
              <X size={32} />
            </button>
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Chatbot - Fixed at bottom right */}
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}