import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function CropGuidanceChatbot() {
  // State for form data
  const [formData, setFormData] = useState({
    region: "",
    latlong: "",
    soil_type: "",
    soil_ph: "",
    moisture: "",
    npk: "",
    season: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    sunlight: "",
    previous_crop: "",
    harvest_date: "",
    irrigation: "",
    fertilizer: "",
    equipment: "",
    crop_type: "",
    market: "",
    land_size: "",
    language: "",
  });

  // Chat state
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your AI Crop Guidance Assistant. I'll help you find the best crops for your land. Let's start with some questions. What region, state or country are you farming in?",
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("region");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState("");

  const chatEndRef = useRef(null);

  // Questions in sequence with their prompt texts
  const questions = {
    region: {
      prompt: "What region, state or country are you farming in?",
      nextQuestion: "soil_type",
    },
    soil_type: {
      prompt:
        "What type of soil do you have? (Loamy, Sandy, Clay, Silty, Peaty, Saline)",
      nextQuestion: "soil_ph",
      options: ["Loamy", "Sandy", "Clay", "Silty", "Peaty", "Saline"],
    },
    soil_ph: {
      prompt: "What is your soil pH? (e.g., 6.5)",
      nextQuestion: "season",
    },
    season: {
      prompt: "Which growing season are you planning for? (Kharif, Rabi, Zaid)",
      nextQuestion: "rainfall",
      options: ["Kharif", "Rabi", "Zaid"],
    },
    rainfall: {
      prompt:
        "What's the rainfall pattern in your area? (Low, Moderate, Heavy)",
      nextQuestion: "temperature",
      options: ["Low", "Moderate", "Heavy"],
    },
    temperature: {
      prompt: "What's the temperature range in your area? (e.g., 25-35°C)",
      nextQuestion: "humidity",
    },
    humidity: {
      prompt: "What's the average humidity percentage in your area?",
      nextQuestion: "previous_crop",
    },
    previous_crop: {
      prompt: "What crop did you previously grow on this land?",
      nextQuestion: "irrigation",
    },
    irrigation: {
      prompt:
        "What irrigation method do you use? (Drip, Sprinkler, Canal, Rainfed)",
      nextQuestion: "land_size",
      options: ["Drip", "Sprinkler", "Canal", "Rainfed"],
    },
    land_size: {
      prompt: "How large is your land? (e.g., 2 acres)",
      nextQuestion: "crop_type",
    },
    crop_type: {
      prompt: "Do you have any preferred crop type you'd like to grow?",
      nextQuestion: "language",
    },
    language: {
      prompt:
        "What language would you like to receive guidance in? (default is English)",
      nextQuestion: "complete",
    },
    complete: {
      prompt:
        "Great! I now have all the information I need. Would you like me to analyze and provide crop guidance?",
      nextQuestion: null,
    },
  };

  // Optional fields we're skipping to keep the conversation shorter
  // latlong, moisture, npk, sunlight, harvest_date, fertilizer, equipment, market

  // Scroll to bottom of chat when history updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Process user input
  const handleSubmit = () => {
    if (!currentInput.trim() && !questions[currentQuestion].options) return;

    // Add user message to chat
    const userInput = currentInput.trim() || "Proceed";
    setChatHistory((prev) => [...prev, { role: "user", content: userInput }]);
    setCurrentInput("");

    // Handle field edit requests when in isComplete mode
    if (isComplete) {
      const fieldToEdit = checkForEditRequest(userInput);
      if (fieldToEdit) {
        handleEditField(fieldToEdit);
        return;
      }
    }

    // Update form data with user's answer
    if (currentQuestion !== "complete") {
      setFormData((prev) => ({ ...prev, [currentQuestion]: userInput }));
    }

    // If this is the final confirmation step
    if (currentQuestion === "complete") {
      if (
        userInput.toLowerCase().includes("yes") ||
        userInput.toLowerCase().includes("sure") ||
        userInput.toLowerCase() === "y" ||
        userInput.toLowerCase() === "proceed"
      ) {
        // Show loading message
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Analyzing your farm data and generating crop guidance... This may take a moment.",
          },
        ]);

        setIsSubmitting(true);

        // Attempt to make API call, fallback to local generation
        try {
          fetch("http://127.0.0.1:8000/api/crop-guidance/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("API call failed");
              }
              return response.json();
            })
            .then((data) => {
              const guidance = data.guidance || "No result returned.";
              setResult(guidance);
              setChatHistory((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Here's your personalized crop guidance:",
                },
              ]);
              setIsComplete(true);
              setIsSubmitting(false);
            })
            .catch((error) => {
              // Fallback to local generation if API fails
              console.log("API call failed, using local generation:", error);
              const guidance = generateGuidance(formData);
              setResult(guidance);
              setChatHistory((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Here's your personalized crop guidance:",
                },
              ]);
              setIsComplete(true);
              setIsSubmitting(false);
            });
        } catch (error) {
          // Handle any unexpected errors
          setChatHistory((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Sorry, there was an error generating your crop guidance. Please try again later.",
            },
          ]);
          setIsSubmitting(false);
        }
      } else {
        // User doesn't want to proceed, ask if they want to change anything
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "No problem. Is there any information you'd like to change before we generate your guidance? Just let me know which field.",
          },
        ]);
      }
    } else {
      // Move to next question
      const nextQ = questions[currentQuestion].nextQuestion;
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: questions[nextQ].prompt,
          },
        ]);
        setCurrentQuestion(nextQ);
      }, 500);
    }
  };

  // Handle quick reply options if available
  const handleQuickReply = (option) => {
    // First update chat history with the selected option
    setChatHistory((prev) => [...prev, { role: "user", content: option }]);

    // Update form data with the selected option
    setFormData((prev) => ({ ...prev, [currentQuestion]: option }));

    // Move to next question
    const nextQ = questions[currentQuestion].nextQuestion;
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: questions[nextQ].prompt,
        },
      ]);
      setCurrentQuestion(nextQ);
    }, 500);
  };

  // Handle keypresses to detect Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Handle user wanting to edit a previous answer
  const handleEditField = (field) => {
    if (questions[field]) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: questions[field].prompt,
        },
      ]);
      setCurrentQuestion(field);
      setIsComplete(false);
    }
  };

  // Parse user input for field edit requests
  const checkForEditRequest = (input) => {
    const fieldMap = {
      region: ["region", "location", "place", "area", "country", "state"],
      soil_type: ["soil type", "soil", "dirt", "ground", "earth"],
      soil_ph: ["ph", "acidity", "soil ph"],
      season: ["season", "growing season", "planting season"],
      rainfall: ["rain", "rainfall", "precipitation", "water from sky"],
      temperature: ["temperature", "temp", "climate", "how hot", "how cold"],
      humidity: ["humidity", "humid", "moisture in air"],
      previous_crop: [
        "previous crop",
        "last crop",
        "what you grew before",
        "earlier crop",
      ],
      irrigation: ["irrigation", "watering", "water system", "water method"],
      land_size: [
        "land size",
        "acreage",
        "field size",
        "farm size",
        "how large",
        "how big",
      ],
      crop_type: [
        "crop type",
        "preferred crop",
        "what to grow",
        "crop preference",
      ],
    };

    const inputLower = input.toLowerCase();
    for (const [field, keywords] of Object.entries(fieldMap)) {
      if (keywords.some((keyword) => inputLower.includes(keyword))) {
        return field;
      }
    }

    return null;
  };

  // Inject Amazon product links into specific keywords
  const injectProductLinks = (text) => {
    if (!text) return "";

    const keywords = {
      fertilizer: "https://www.amazon.in/s?k=fertilizer",
      vermicompost: "https://www.amazon.in/s?k=vermicompost",
      manure: "https://www.amazon.in/s?k=manure",
      pesticide: "https://www.amazon.in/s?k=pesticide",
      irrigation: "https://www.amazon.in/s?k=irrigation+kit",
    };

    const pattern = new RegExp(
      `\\b(${Object.keys(keywords).join("|")})\\b`,
      "gi"
    );

    return text.replace(pattern, (match) => {
      const url = keywords[match.toLowerCase()];
      return `[${match}](${url})`;
    });
  };

  // Generate guidance based on form data (for demo)
  const generateGuidance = (data) => {
    // This is a simplified version - in production this would come from your API
    return `## Crop Recommendation for ${data.region}

Based on your inputs (${data.soil_type} soil with pH ${data.soil_ph}, ${
      data.rainfall
    } rainfall during ${data.season} season), here are my recommendations:

### Recommended Crops:
${
  data.season === "Kharif"
    ? "1. **Rice** - Excellent for your conditions\n2. **Cotton** - Good market value\n3. **Soybeans** - Nitrogen fixing benefits"
    : data.season === "Rabi"
    ? "1. **Wheat** - Well suited for your soil type\n2. **Mustard** - Drought resistant\n3. **Chickpeas** - Good rotation crop"
    : "1. **Watermelon** - High yield potential\n2. **Cucumber** - Fast growing\n3. **Pumpkin** - Low maintenance"
}

### Cultivation Practices:
- Prepare soil with proper tillage
- Apply balanced fertilizer based on soil test
- Consider using vermicompost for better soil health
- Implement crop rotation to improve soil fertility

### Irrigation Strategy:
Your ${data.irrigation} irrigation system is ${
      data.irrigation === "Drip"
        ? "excellent for water conservation"
        : data.irrigation === "Sprinkler"
        ? "good for even distribution"
        : data.irrigation === "Canal"
        ? "suitable but monitor water usage"
        : "challenging - consider supplemental irrigation"
    }

### Disease Management:
- Regular monitoring for pests and diseases
- Consider organic pesticide options where possible
- Maintain field hygiene to prevent disease spread

### Market Outlook:
Demand for these crops is currently strong in your region, with good potential for profitability given your ${
      data.land_size
    } land holding.

Let me know if you'd like more detailed information on any specific crop!`;
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        AI Crop Guidance Assistant
      </h1>

      <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl flex flex-col h-96 md:h-128">
        {/* Chat history */}
        <div className="flex-grow overflow-y-auto p-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "assistant" ? "text-left" : "text-right"
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-3/4 ${
                  message.role === "assistant"
                    ? "bg-green-100 text-gray-800"
                    : "bg-green-600 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick reply options */}
        {!isComplete && !isSubmitting && questions[currentQuestion].options && (
          <div className="px-4 py-2 flex flex-wrap gap-2">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(option)}
                className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        {!isSubmitting && (
          <div className="border-t p-2 flex">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmit}
              className="ml-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
              disabled={isSubmitting}
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Display result after completion */}
      {isComplete && result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            Your Personalized Crop Guidance:
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{injectProductLinks(result)}</ReactMarkdown>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                // Reset the chat to start over
                setChatHistory([
                  {
                    role: "assistant",
                    content:
                      "👋 Hello! I'm your AI Crop Guidance Assistant. I'll help you find the best crops for your land. Let's start with some questions. What region, state or country are you farming in?",
                  },
                ]);
                setFormData({
                  region: "",
                  latlong: "",
                  soil_type: "",
                  soil_ph: "",
                  moisture: "",
                  npk: "",
                  season: "",
                  rainfall: "",
                  temperature: "",
                  humidity: "",
                  sunlight: "",
                  previous_crop: "",
                  harvest_date: "",
                  irrigation: "",
                  fertilizer: "",
                  equipment: "",
                  crop_type: "",
                  market: "",
                  land_size: "",
                  language: "",
                });
                setCurrentQuestion("region");
                setIsComplete(false);
                setResult("");
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl flex-grow"
            >
              Start a New Consultation
            </button>

            <button
              onClick={() => {
                // Add a message for editing
                setChatHistory((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content:
                      "If you'd like to edit any information, just tell me which field you want to change (e.g., 'change my region' or 'edit soil type').",
                  },
                ]);
              }}
              className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-xl"
            >
              Edit Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
