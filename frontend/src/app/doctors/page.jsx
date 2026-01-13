"use client";

import { useEffect, useState } from "react";
import { X, Calendar, User, Phone, Mail, FileText, Clock } from "lucide-react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_age: "",
    sex: "",
    reason: "",
    visit_time: "",
    number: "",
    your_email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/doctors/doctors/")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching doctors: ${text}`);
        }
        return res.json();
      })
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMakeAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setSelectedDoctor(null);
    setFormData({
      patient_name: "",
      patient_age: "",
      sex: "",
      reason: "",
      visit_time: "",
      number: "",
      your_email: "",
    });
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor first!");
      return;
    }

    if (!formData.patient_name || !formData.patient_age || !formData.sex || 
        !formData.reason || !formData.visit_time || !formData.number || !formData.your_email) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const createRes = await fetch(
        `http://localhost:8000/doctors/doctors/${selectedDoctor.id}/create/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const createData = await createRes.json();
      const appointmentId = createData.appointment_id;

      const checkoutRes = await fetch(
        "http://localhost:8000/doctors/stripe/create-checkout-session/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointment_id: appointmentId }),
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

  return (
    <div className="min-h-screen bg-green-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-8 shadow-lg relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center">Book Your Appointment</h1>
          <p className="text-center mt-2 text-green-100">
            Connect with experienced healthcare professionals
          </p>
        </div>
      </div>

      {/* Doctors List */}
      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/90 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.photo || "/default-doctor.jpg"}
                    alt={doc.name}
                    onClick={() => setExpandedImage(doc.photo || "/default-doctor.jpg")}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-100 cursor-pointer hover:border-green-400 transition-all"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-900 mb-1">
                      {doc.name}
                    </h3>
                    <p className="text-green-700 text-sm mb-2">
                      {doc.qualifications}
                    </p>
                    <div className="inline-flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-full font-semibold">
                      ${doc.fees || 50} consultation fee
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                {doc.certificates && doc.certificates.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-green-800 mb-2">
                      Certifications
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {doc.certificates.map((certUrl, idx) => (
                        <img
                          key={idx}
                          src={certUrl}
                          alt={`Certificate ${idx + 1}`}
                          onClick={() => setExpandedImage(certUrl)}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-green-200 cursor-pointer hover:border-green-400 transition-all hover:scale-105"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() => handleMakeAppointment(doc)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-lime-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Form Modal */}
      {formVisible && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Book Appointment</h2>
                <p className="text-green-100 text-sm mt-1">
                  with Dr. {selectedDoctor.name}
                </p>
              </div>
              <button
                onClick={closeForm}
                className="text-white hover:bg-green-600 rounded-full p-2 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="patient_name"
                  placeholder="Enter your full name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Age and Sex */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">Age</label>
                  <input
                    type="number"
                    name="patient_age"
                    placeholder="Age"
                    value={formData.patient_age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  placeholder="Describe your symptoms or reason for visit"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Visit Time */}
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="visit_time"
                  value={formData.visit_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="number"
                  placeholder="Enter your phone number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="your_email"
                  placeholder="Enter your email"
                  value={formData.your_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeForm}
                  className="flex-1 px-6 py-3 border-2 border-green-300 text-green-900 font-semibold rounded-lg hover:bg-green-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-lime-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Calendar className="inline w-4 h-4 mr-2" />
                      Book & Pay ${selectedDoctor.fees || 50}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Expansion Modal */}
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
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px,0px) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
