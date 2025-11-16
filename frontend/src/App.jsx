import { useState } from "react";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { useToast } from "./hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const SUPPORTED_CLASSES = [
  "Apple — Apple Scab",
  "Apple — Black Rot",
  "Apple — Cedar Apple Rust",
  "Apple — Healthy",
  "Blueberry — Healthy",
  "Cherry — Powdery Mildew",
  "Cherry — Healthy",
  "Corn — Cercospora Leaf Spot / Gray Leaf Spot",
  "Corn — Common Rust",
  "Corn — Northern Leaf Blight",
  "Corn — Healthy",
  "Grape — Black Rot",
  "Grape — Esca (Black Measles)",
  "Grape — Leaf Blight (Isariopsis Leaf Spot)",
  "Grape — Healthy",
  "Orange — Citrus Greening",
  "Peach — Bacterial Spot",
  "Peach — Healthy",
  "Pepper Bell — Bacterial Spot",
  "Pepper Bell — Healthy",
  "Potato — Early Blight",
  "Potato — Late Blight",
  "Potato — Healthy",
  "Raspberry — Healthy",
  "Soybean — Healthy",
  "Squash — Powdery Mildew",
  "Strawberry — Leaf Scorch",
  "Strawberry — Healthy",
  "Tomato — Bacterial Spot",
  "Tomato — Early Blight",
  "Tomato — Late Blight",
  "Tomato — Leaf Mold",
  "Tomato — Septoria Leaf Spot",
  "Tomato — Spider Mites",
  "Tomato — Target Spot",
  "Tomato — Yellow Leaf Curl Virus",
  "Tomato — Mosaic Virus",
  "Tomato — Healthy",
];

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const { toast } = useToast();

  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageFile(file);
    else toast({ title: "Invalid file", variant: "destructive" });
  };

  const handleFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleImageFile(f);
  };

  const handleImageFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setResult(null);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };

  const handlePredict = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://plant-disease-detection-389o.onrender.com/predict/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        if (data.found) {
          setResult({
            found: true,
            healthy: !data.affected,
            plant: data.plant,
            disease: data.disease,
            confidence: data.confidence.toFixed(2),
          });
        } else setResult({ found: false });
      } else throw new Error(data.message || "Prediction failed");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 overflow-hidden">

      {/* floating blur circles */}
      <div className="absolute w-80 h-80 bg-green-300/40 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300/40 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* floating info icon */}
      <div
        className="fixed top-6 right-6 z-50 cursor-pointer bg-white/70 backdrop-blur-lg shadow-xl p-3 rounded-full hover:scale-110 transition-all"
        onClick={() => setShowPopup(!showPopup)}
      >
        <Info className="w-6 h-6 text-teal-600" />
      </div>

      {/* popup panel */}
      {showPopup && (
        <div className="fixed top-20 right-6 w-72 z-50 p-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 animate-fade-in">
          <h3 className="font-semibold text-xl mb-4 text-gray-700">Supported Diseases</h3>

          <input
            className="w-full mb-3 p-2 rounded-lg border border-gray-300"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 text-gray-700">
            {SUPPORTED_CLASSES.filter((c) =>
              c.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((c, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {c}
              </div>
            ))}
          </div>

          <Button className="w-full mt-4" onClick={() => setShowPopup(false)}>
            Close
          </Button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-16 relative z-10">

        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent drop-shadow">
            Plant Disease Detection
          </h1>
          <p className="mt-3 text-gray-700 text-lg">
            Upload a leaf image and let AI analyze it instantly.
          </p>
        </header>

        <div className="max-w-3xl mx-auto space-y-8">

          {/* upload card */}
          <Card
            className={`border-2 border-dashed p-12 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl transition-all hover:shadow-2xl
            ${isDragging ? "border-teal-500 scale-[1.02] bg-white/60" : "border-gray-300"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileInput} />

            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-teal-200/40 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner">
                <Upload className="w-12 h-12 text-teal-600" />
              </div>
              <p className="text-xl font-semibold text-gray-700">Drop or upload image</p>
            </label>
          </Card>

          {/* image preview */}
          {selectedImage && (
            <Card className="p-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl">
              <img src={selectedImage} className="w-full rounded-xl shadow" />
            </Card>
          )}

          {/* predict button */}
          {selectedImage && !result && (
            <div className="text-center">
              <Button
                onClick={handlePredict}
                disabled={isAnalyzing}
                className="px-10 py-3 text-lg rounded-2xl shadow-lg hover:shadow-xl bg-gradient-to-r from-green-600 to-teal-600 text-white"
              >
                {isAnalyzing ? "Analyzing..." : "Predict Disease"}
              </Button>
            </div>
          )}

          {/* RESULT SECTION */}
          {result && (
            <>
              {!result.found && (
                <Card className="p-8 text-center bg-red-100 border border-red-300 rounded-3xl shadow-xl">
                  <AlertCircle className="w-14 h-14 text-red-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-red-700">Image Not Recognized</h3>
                  <p className="text-red-600">Try another leaf image.</p>
                </Card>
              )}

              {result.found && (
                <Card
                  className={`p-8 rounded-3xl shadow-xl backdrop-blur-xl
                  ${result.healthy ? "bg-green-100/70" : "bg-yellow-100/70"}`}
                >
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                      {result.healthy ? (
                        <CheckCircle2 className="w-9 h-9 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-9 h-9 text-yellow-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-3xl font-bold">
                        {result.healthy ? "Healthy Leaf 🌿" : result.disease}
                      </h3>

                      <p className="mt-2 text-gray-700">
                        <strong>Plant:</strong> {result.plant}
                      </p>

                      <p className="mt-4 mb-1 font-medium">Confidence:</p>
                      <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${result.confidence}%` }}
                          className="h-full bg-green-600"
                        />
                      </div>
                      <p className="mt-1 font-semibold">{result.confidence}%</p>

                      <Button
                        variant="outline"
                        className="mt-6 rounded-xl"
                        onClick={() => {
                          setSelectedImage(null);
                          setResult(null);
                        }}
                      >
                        Analyze Another Leaf
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          <div className="text-center mt-12 text-sm text-gray-600">
            Powered by AI • Fast & Accurate
          </div>

          {/* Disclaimer */}
          {showDisclaimer && (
            <div className="max-w-3xl mx-auto mt-6 p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30">
              <p className="text-gray-800 mb-2">
                <strong className="text-green-600">Use:</strong> This tool only works for leaves listed in the supported diseases list.
              </p>

              <p className="text-red-600 text-sm mt-2">
                <strong>Disclaimer:</strong> AI prediction is not a substitute for expert agricultural diagnosis.
              </p>

              <div className="mt-4 text-right">
                <Button variant="ghost" onClick={() => setShowDisclaimer(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}

          {!showDisclaimer && (
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => setShowDisclaimer(true)}
              >
                Disclaimer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
