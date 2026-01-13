"use client";

import { useEffect, useState } from "react";

export default function GroupPostsPage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("groups");
  const [groupId, setGroupId] = useState(null);

  const tabs = [
    { id: 'feed', label: 'Feed', route: '/posts' },
    { id: 'groups', label: 'Groups', route: '/groups' },
    { id: 'catalyst-partners', label: 'Catalyst Partners', route: '/catalytic_partners' },
    { id: 'seeking-mentors', label: 'Seeking Mentors?', route: '/payments' },
    { id: 'discover-startups', label: 'Discover Startups', route: '/capital' },
    { id: 'ai-guidance', label: 'AI Guidance', route: '/smart_chat' }
  ];

  useEffect(() => {
    // Get groupId from URL (example: /posts/group/123)
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.indexOf('group') + 1];
    setGroupId(id);

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));

    const fetchGroupPosts = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/posts/group/${id}/`
        );
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchGroupPosts();
  }, []);

  const handleUpvote = async (postId) => {
    if (!user) return alert("Login to upvote!");
    try {
      const res = await fetch(`http://127.0.0.1:8000/posts/upvote/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, post_id: postId }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, upvotes_count: p.upvotes_count + 1 } : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goToComments = (postId) => {
    window.location.href = `/posts/${postId}/comments`;
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
                Group Posts
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
              Explore posts from this community group
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

        {/* Posts */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          {posts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg">
              <p className="text-gray-500 text-lg">No posts in this group yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/90 backdrop-blur-md border-2 border-green-200 rounded-2xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {post.user ? post.user.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-green-600">{post.user || 'Anonymous'}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-800 text-lg leading-relaxed mb-3">{post.description}</p>
                
                {post.photo && (
                  <img
                    src={post.photo}
                    alt="post"
                    className="w-full rounded-xl mt-4 shadow-md max-h-96 object-cover"
                  />
                )}

                {/* Tag if available */}
                {post.tag && (
                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-white text-sm ${
                        post.tag === "idea_presentation"
                          ? "bg-yellow-500"
                          : post.tag === "accomplishment"
                          ? "bg-green-500"
                          : post.tag === "announcement"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {post.tag === "idea_presentation"
                        ? "Idea Presentation"
                        : post.tag === "accomplishment"
                        ? "Accomplishment"
                        : post.tag === "announcement"
                        ? "Announcement"
                        : post.tag}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-green-200 mt-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
                  >
                    👍 Upvote ({post.upvotes_count || 0})
                  </button>

                  <button
                    onClick={() => goToComments(post.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
                  >
                    💬 Comments ({post.comments_count || 0})
                  </button>
                </div>
              </div>
            ))
          )}
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