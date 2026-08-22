import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiServices } from "../services/api"; // Re-uses your centralized api configurations
import axios from "axios";
import { ArrowLeft, PlusCircle, Loader2 } from "lucide-react";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Programming",
    price: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Please fill out the core title and description parameters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      // Deliver the state elements down directly to your core node endpoint pipeline
      const res = await axios.post(`${baseUrl}/api/courses`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0.0,
        instructorId: 1, // Matches your current active mock user parameters tracking context
      });

      if (res.data.success) {
        navigate("/courses"); // Return directly to your core catalog to verify entry card creation
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to create course. Ensure database server connections are stable.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-white">
      <button
        onClick={() => navigate("/courses")}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-6 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400" /> Back to Catalog
      </button>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2 text-emerald-400">
            <PlusCircle className="w-5 h-5" /> Publish New Module Course
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill out the metadata options to instantly broadcast your structural
            content assets hub.
          </p>
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold tracking-wide text-slate-400 uppercase text-[10px]">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Advanced Full-Stack Architecture Node"
              className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2.5 transition text-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold tracking-wide text-slate-400 uppercase text-[10px]">
              Course Syllabus Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive summary detailing layout components, logic configurations, and lesson models..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2.5 transition text-slate-200 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold tracking-wide text-slate-400 uppercase text-[10px]">
                Track Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2.5 transition text-slate-200 cursor-pointer"
              >
                <option value="Programming">Programming & Systems</option>
                <option value="Design">UI/UX Creative Design</option>
                <option value="Business">Business Engineering</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold tracking-wide text-slate-400 uppercase text-[10px]">
                Price Tier (ETB)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00 (Leave empty for Free Access)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2.5 transition text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 px-4 rounded-xl transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Deploy Course Live"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
