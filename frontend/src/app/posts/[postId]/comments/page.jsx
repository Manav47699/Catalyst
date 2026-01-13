"use client";

import { useEffect, useState } from "react";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [postId, setPostId] = useState(null);

  const tabs = [
    { id: 'feed', label: 'Feed', route: '/posts' },
    { id: 'groups', label: 'Groups', route: '/groups' },
    { id: 'catalyst-partners', label: 'Catalyst Partners', route: '/catalytic_partners' },
    { id: 'seeking-mentors', label: 'Seeking Mentors?', route: '/payments' },
    { id: 'discover-startups', label: 'Discover Startups', route: '/capital' },
    { id: 'ai-guidance', label: 'AI Guidance', route: '/smart_chat' }
  ];

  useEffect(() => {
    // Get postId from URL (example: /posts/123/comments)
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.indexOf('posts') + 1];
    setPostId(id);

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/posts/${id}/comments/`
        );
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!user) return alert("You must be logged in to comment");
    if (!newComment.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/posts/comment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          post_id: postId,
          text: newComment,
        }),
      });

      if (res.ok) {
        setNewComment("");
        const data = await res.json();
        setComments((prev) => [...prev, data]);
      } else {
        const data = await res.json();
        alert(data.error || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
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
                Comments
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
              Join the conversation and share your thoughts
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

        {/* Comments Content */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          {user && (
            <div className="mb-6 bg-white/90 backdrop-blur-md border-2 border-green-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-green-600 mb-4">Add a Comment</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="4"
                className="w-full p-4 rounded-xl border-2 border-green-200 focus:outline-none focus:border-green-400 transition-colors mb-4 text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleAddComment}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-lime-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                 Post Comment
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg">
                <p className="text-gray-500 text-lg">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white/90 backdrop-blur-md border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {comment.user ? comment.user.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-600 mb-1">{comment.user || 'Anonymous'}</p>
                      <p className="text-gray-800 leading-relaxed mb-2">{comment.text}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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