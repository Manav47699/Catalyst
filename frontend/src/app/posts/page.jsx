"use client";

import { useState, useRef, useEffect } from "react";
import Chatbot from "../../components/Chatbot";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  const [newPost, setNewPost] = useState({
    description: "",
    photo: null,
    tag: "idea_presentation",
    group: "",
  });

  const tabs = [
    { id: 'feed', label: 'Feed', route: '/posts' },
    { id: 'groups', label: 'Groups', route: '/groups' },
    { id: 'catalyst-partners', label: 'Catalyst Partners', route: '/catalytic_partners' },
    { id: 'seeking-mentors', label: 'Seeking Mentors?', route: '/payments' },
    { id: 'discover-startups', label: 'Discover Startups', route: '/capital' },
    { id: 'ai-guidance', label: 'AI Guidance', route: '/smart_chat' }
  ];

  const TAGS = [
    { value: "", label: "All" },
    { value: "idea_presentation", label: "Idea Presentation" },
    { value: "accomplishment", label: "Accomplishment" },
    { value: "announcement", label: "Announcement" },
  ];

  useEffect(() => {
    fetchPosts();
    fetchGroups();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, [tagFilter]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/posts/${tagFilter ? `?tag=${tagFilter}` : ""}`
      );
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/groups/");
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleBack = () => window.history.back();

  const navigateToTab = (route) => {
    window.location.href = route;
  };

  const handleUpvote = async (postId) => {
    if (!user) return alert("You must be logged in to upvote");

    try {
      const res = await fetch("http://127.0.0.1:8000/posts/upvote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, post_id: postId }),
      });

      if (res.ok) fetchPosts();
      else {
        const data = await res.json();
        alert(data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goToComments = (postId) => {
    window.location.href = `/posts/${postId}/comments`;
  };

  const handleCreatePost = async () => {
    if (!user) return alert("You must be logged in to create a post");

    try {
      const formData = new FormData();
      formData.append("description", newPost.description);
      if (newPost.photo) formData.append("photo", newPost.photo);
      formData.append("tag", newPost.tag);
      if (newPost.group) formData.append("group", newPost.group);
      formData.append("user", user.id);

      const res = await fetch("http://127.0.0.1:8000/posts/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Post created!");
        setNewPost({ description: "", photo: null, tag: "idea_presentation", group: "" });
        setShowForm(false);
        fetchPosts();
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
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
                Home Feed
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
              {user
                ? `Welcome back, ${user.username}! Explore your feed`
                : "Explore posts and connect with the community"}
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

        {/* Filter by Tag */}
        <div className="max-w-3xl mx-auto px-4 py-6 flex justify-end gap-4">
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none transition-colors shadow-md bg-white text-gray-900 font-medium"
          >
            {TAGS.map((tag) => (
              <option key={tag.value} value={tag.value}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 pb-8">
          {/* Create Post */}
          {user && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-lime-600 text-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl font-medium"
              >
                {showForm ? "✕ Cancel" : " Create New Post"}
              </button>
            </div>
          )}

          {showForm && (
            <div className="bg-white/90 backdrop-blur-md border-2 border-green-200 rounded-2xl p-6 shadow-xl mb-6">
              <h3 className="text-2xl font-bold text-green-600 mb-6">Share Your Thoughts</h3>
              <textarea
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none mb-4 text-gray-900"
                placeholder="What's on your mind?"
              />
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Tag</label>
                <select
                  value={newPost.tag}
                  onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none text-gray-900"
                >
                  {TAGS.filter((t) => t.value !== "").map((tag) => (
                    <option key={tag.value} value={tag.value}>
                      {tag.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPost({ ...newPost, photo: e.target.files[0] })}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none text-gray-900"
                />
              </div>
              <button
                onClick={handleCreatePost}
                className="w-full px-6 py-4 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl font-medium"
              >
                📤 Publish Post
              </button>
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 text-center shadow-lg">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white/90 backdrop-blur-md border-2 border-green-200 rounded-2xl p-6 shadow-lg mb-6 hover:shadow-xl transition-all duration-300"
              >
                <p className="font-semibold text-gray-900">{post.user || "Anonymous"}</p>
                <p className="text-gray-500 text-xs mb-3">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-800 text-lg leading-relaxed mb-3">{post.description}</p>
                {post.photo && (
                  <img
                    src={`http://127.0.0.1:8000${post.photo}`}
                    alt="Post"
                    className="mt-2 rounded-xl w-full object-cover max-h-96 shadow-md"
                  />
                )}
                {/* Tag Highlight */}
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

                <div className="flex gap-3 pt-4 border-t border-green-200 mt-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
                  >
                     Upvote ({post.upvotes_count || 0})
                  </button>
                  <button
                    onClick={() => goToComments(post.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg font-medium"
                  >
                     Comments ({post.comments_count || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chatbot fixed at bottom-right */}
      <div className="fixed bottom-6 right-6 z-50">
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
