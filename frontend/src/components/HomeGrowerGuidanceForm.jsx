import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

/**
 * HomeGrowerGuidanceChatbot
 * 
 * A conversational React component that guides home gardeners through a series of questions
 * to collect information about their gardening space, preferences, and experience. 
 * Based on the user's responses, it generates personalized gardening advice and plant suggestions.
 * 
 * Features:
 * - Step-by-step chat interface with assistant and user messages.
 * - Quick reply options for certain questions.
 * - Handles user input, including editing previous answers.
 * - Calls an API for guidance, with a local fallback if the API fails.
 * - Displays a personalized garden plan upon completion.
 * 
 * State:
 * - formData: Object containing all user responses.
 * - chatHistory: Array of chat messages (assistant/user).
 * - currentInput: Current text input from the user.
 * - currentQuestion: Key of the current question being asked.
 * - isSubmitting: Boolean indicating if the API call is in progress.
 * - isComplete: Boolean indicating if the chat is finished and advice is shown.
 * - result: The generated gardening advice (Markdown).
 * 
 * Functions:
 * - handleSubmit: Processes user input and advances the chat.
 * - handleQuickReply: Handles quick reply button selection.
 * - handleKeyPress: Submits input on Enter key.
 * - handleEditField: Allows user to edit a previous answer.
 * - checkForEditRequest: Parses input to detect edit requests.
 * - generateGuidance: Generates gardening advice based on formData.
 * 
 * UI:
 * - Chat window with scrolling history.
 * - Quick reply buttons for select questions.
 * - Input area for user responses.
 * - Displays personalized advice after completion.
 * 
 * @component
 */
export default function HomeGrowerGuidanceChatbot() {
  // State for form data
  const [formData, setFormData] = useState({
    location: "",
    space_type: "",
    space_size: "",
    sunlight: "",
    containers: "",
    soil_type: "",
    water_availability: "",
    temperature: "",
    humidity: "", // Added from second component
    effort_level: "",
    preferred_plants: "",
    experience: "",
    language: "",
  });

  // Chat state
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your Home Gardening Assistant. I'll help you find the perfect plants for your space. Let's start with some questions. What city or region do you live in?",
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("location");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState("");

  const chatEndRef = useRef(null);

  // Questions in sequence with their prompt texts
  const questions = {
    location: {
      prompt: "What city or region do you live in?",
      nextQuestion: "space_type",
    },
    space_type: {
      prompt:
        "What type of space do you have for gardening? (Rooftop, Balcony, Backyard, Indoor, Greenhouse)",
      nextQuestion: "space_size",
      options: ["Rooftop", "Balcony", "Backyard", "Indoor", "Greenhouse"],
    },
    space_size: {
      prompt:
        "What's the approximate size of your gardening space? (e.g., 5x5 ft)",
      nextQuestion: "sunlight",
    },
    sunlight: {
      prompt:
        "How many hours of sunlight does your space get per day? (e.g., 4-6 hrs)",
      nextQuestion: "containers",
    },
    containers: {
      prompt:
        "What type of containers do you have or plan to use? (e.g., pots, raised beds)",
      nextQuestion: "soil_type",
    },
    soil_type: {
      prompt: "What type of soil do you have or plan to use?",
      nextQuestion: "water_availability",
      options: ["Potting Mix", "Loamy", "Sandy", "Compost-enriched", "Clay"],
    },
    water_availability: {
      prompt: "How often can you water your plants?",
      nextQuestion: "temperature",
      options: ["Daily", "Alternate Days", "Limited"],
    },
    temperature: {
      prompt:
        "What's the usual temperature range in your area? (e.g., 20-35°C)",
      nextQuestion: "humidity", // Added humidity question
    },
    humidity: {
      // Added from second component
      prompt:
        "What's the humidity level in your area? (e.g., 60%, or 'low', 'moderate', 'high')",
      nextQuestion: "effort_level",
    },
    effort_level: {
      prompt: "How much effort can you put into gardening?",
      nextQuestion: "preferred_plants",
      options: ["Minimal", "Moderate", "High"],
    },
    preferred_plants: {
      prompt:
        "Do you have any preferred plants you'd like to grow? (e.g., Tomatoes, Herbs)",
      nextQuestion: "experience",
    },
    experience: {
      prompt: "What's your level of gardening experience?",
      nextQuestion: "language",
      options: ["None", "Beginner", "Intermediate", "Expert"],
    },
    language: {
      prompt:
        "What language would you like to receive guidance in? (default is English)",
      nextQuestion: "complete",
    },
    complete: {
      prompt:
        "Great! I have all the information I need. Would you like me to provide personalized gardening advice now?",
      nextQuestion: null,
    },
  };

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
              "Analyzing your space and preferences to find the perfect plants for you... This may take a moment.",
          },
        ]);

        setIsSubmitting(true);

        // Attempt to make API call, fallback to local generation
        try {
          fetch("http://127.0.0.1:8000/api/home_garden_guidance/", {
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
                  content: "Here's your personalized gardening advice:",
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
                  content: "Here's your personalized gardening advice:",
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
                "Sorry, there was an error generating your gardening advice. Please try again later.",
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
              "No problem. Is there any information you'd like to change before we generate your gardening advice? Just let me know which field.",
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
    }
  };

  // Parse user input for field edit requests
  const checkForEditRequest = (input) => {
    const fieldMap = {
      location: ["location", "city", "region", "where i live", "place"],
      space_type: [
        "space type",
        "type of space",
        "garden type",
        "gardening space",
      ],
      space_size: ["space size", "size", "area", "dimensions"],
      sunlight: ["sunlight", "sun", "light", "hours of sun"],
      containers: ["containers", "pots", "planting in", "container type"],
      soil_type: ["soil", "soil type", "dirt", "growing medium"],
      water_availability: [
        "water",
        "watering",
        "irrigation",
        "how often water",
      ],
      temperature: ["temperature", "temp", "climate", "how hot", "how cold"],
      humidity: ["humidity", "humid", "moisture in air"],
      effort_level: ["effort", "time", "maintenance", "care level"],
      preferred_plants: [
        "plants",
        "preferred plants",
        "want to grow",
        "favorites",
      ],
      experience: ["experience", "skill", "gardening level", "expertise"],
      language: ["language", "lang", "translation"],
    };

    const inputLower = input.toLowerCase();
    for (const [field, keywords] of Object.entries(fieldMap)) {
      if (keywords.some((keyword) => inputLower.includes(keyword))) {
        return field;
      }
    }

    return null;
  };

  // Generate guidance based on form data (for demo)
  const generateGuidance = (data) => {
    // This is a simplified version - in production this would come from your API
    let plantSuggestions = [];

    // Basic logic for plant suggestions based on space, sunlight and experience
    if (data.space_type === "Indoor") {
      if (data.sunlight.includes("2") || parseInt(data.sunlight) < 4) {
        plantSuggestions.push(
          "Snake Plant",
          "ZZ Plant",
          "Pothos",
          "Peace Lily"
        );
      } else {
        plantSuggestions.push(
          "Spider Plant",
          "Herbs (Basil, Mint)",
          "Cherry Tomatoes (dwarf varieties)",
          "Leafy Greens"
        );
      }
    } else if (["Balcony", "Rooftop"].includes(data.space_type)) {
      if (parseInt(data.sunlight) >= 5 || data.sunlight.includes("6")) {
        plantSuggestions.push(
          "Tomatoes",
          "Peppers",
          "Eggplants",
          "Herbs",
          "Marigolds"
        );
      } else {
        plantSuggestions.push(
          "Leafy Greens",
          "Radishes",
          "Green Onions",
          "Ferns",
          "Impatiens"
        );
      }
    } else if (data.space_type === "Backyard") {
      if (data.experience === "None" || data.experience === "Beginner") {
        plantSuggestions.push(
          "Zucchini",
          "Sunflowers",
          "Radishes",
          "Bush Beans",
          "Marigolds"
        );
      } else {
        plantSuggestions.push(
          "Tomatoes",
          "Cucumbers",
          "Peppers",
          "Eggplant",
          "Okra",
          "Leafy Greens"
        );
      }
    } else if (data.space_type === "Greenhouse") {
      plantSuggestions.push(
        "Tomatoes",
        "Peppers",
        "Cucumbers",
        "Herbs",
        "Leafy Greens",
        "Exotic Plants"
      );
    }

    // Include preferred plants if specified
    if (data.preferred_plants) {
      plantSuggestions.unshift(data.preferred_plants);
    }

    // Remove duplicates and limit to 5
    plantSuggestions = [...new Set(plantSuggestions)].slice(0, 5);

    // Include humidity considerations
    let humidityNote = "";
    if (data.humidity) {
      humidityNote = `\n- With ${data.humidity} humidity, consider ${
        data.humidity.includes("high") || parseInt(data.humidity) > 60
          ? "plants that thrive in humid conditions like tropical varieties"
          : data.humidity.includes("low") || parseInt(data.humidity) < 40
          ? "drought-tolerant plants and avoid those that require high humidity"
          : "most common garden plants which should do well in moderate humidity"
      }`;
    }

    return `## Personalized Garden Plan for ${data.location}

Based on your ${data.space_type} garden with ${
      data.sunlight
    } hours of sunlight, here are my recommendations:

### Recommended Plants:
${plantSuggestions
  .map((plant, index) => `${index + 1}. **${plant}**`)
  .join("\n")}

### Setup Tips:
- For your ${data.space_type} environment, use ${
      data.containers || "containers"
    } that provide adequate drainage
- ${
      data.soil_type
    } soil is a good choice; consider adding organic compost for better results
- With your ${data.water_availability.toLowerCase()} water availability, focus on plants with matching water needs
- Given the ${
      data.temperature
    } temperature range, plan your planting schedule accordingly${humidityNote}

### Care Routine (${data.effort_level} Effort):
${
  data.effort_level === "Minimal"
    ? "- Choose drought-tolerant plants that require less frequent watering\n- Use mulch to retain soil moisture longer\n- Consider self-watering containers for convenience\n- Select low-maintenance plants that are forgiving of occasional neglect"
    : data.effort_level === "Moderate"
    ? "- Water plants consistently according to their specific needs\n- Feed with organic fertilizer monthly\n- Check for pests weekly and address issues promptly\n- Prune as needed to encourage healthy growth"
    : "- Implement a regular watering and feeding schedule\n- Monitor plants daily for signs of issues\n- Consider companion planting to maximize space and deter pests\n- Start seeds indoors to extend your growing season"
}

### Getting Started (${data.experience} Level):
${
  data.experience === "None" || data.experience === "Beginner"
    ? "- Begin with just 2-3 plant varieties to avoid feeling overwhelmed\n- Start with seedlings rather than seeds for faster results\n- Keep a simple garden journal to track what works\n- Join local gardening groups for support and advice"
    : "- Consider experimenting with succession planting to maximize harvests\n- Try saving seeds from successful plants for next season\n- Implement crop rotation if growing vegetables\n- Consider building a simple irrigation system for efficiency"
}

I hope this helps you create a thriving garden in your ${
      data.space_type
    }! Let me know if you need specific advice for any of these plant suggestions.`;
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">
        Home Garden Assistant
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
                    ? "bg-emerald-100 text-gray-800"
                    : "bg-emerald-600 text-white"
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
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        {!isComplete && !isSubmitting && (
          <div className="border-t p-2 flex">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmit}
              className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg"
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
          <h2 className="text-xl font-bold text-emerald-700 mb-2">
            Your Personalized Garden Plan:
          </h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                // Reset the chat to start over
                setChatHistory([
                  {
                    role: "assistant",
                    content:
                      "👋 Hello! I'm your Home Gardening Assistant. I'll help you find the perfect plants for your space. Let's start with some questions. What city or region do you live in?",
                  },
                ]);
                setFormData({
                  location: "",
                  space_type: "",
                  space_size: "",
                  sunlight: "",
                  containers: "",
                  soil_type: "",
                  water_availability: "",
                  temperature: "",
                  humidity: "",
                  effort_level: "",
                  preferred_plants: "",
                  experience: "",
                  language: "",
                });
                setCurrentQuestion("location");
                setIsComplete(false);
                setResult("");
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-xl flex-grow"
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
                      "If you'd like to edit any information, just tell me which field you want to change (e.g., 'change my location' or 'edit sunlight').",
                  },
                ]);
                setIsComplete(false);
              }}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold py-2 px-4 rounded-xl"
            >
              Edit Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
