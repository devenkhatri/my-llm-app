import React, { useState, useEffect } from "react";

type Model = {
  id: string;
  name: string;
  description: string;
  architecture: {
    modality: string;
  };
};

type ModelDropdownProps = {
  onModelSelect: (model: Model | null) => void; // Callback to pass selected model to parent component
};

const ModelDropdown: React.FC<ModelDropdownProps> = ({ onModelSelect }) => {
  const [models, setModels] = useState<Model[]>([]); // Stores models fetched from the API
  const [selectedModel, setSelectedModel] = useState<Model | null>(null); // Stores the currently selected model
  const [error, setError] = useState<string | null>(null); // Stores any error messages

  // Fetch models from the API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/getmodels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // console.log("****** response ",response)
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const output = await response.json();
        setModels(output.models.data); // Set fetched models to state
        console.log("****** All Models",output.models)
      } catch (error: any) {
        setError(error.message); // Handle errors
      }
    };

    fetchModels();
  }, []);

  // Handle dropdown change
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = event.target.value;
    const model = models.find((m) => m.id === modelId) || null;
    setSelectedModel(model); // Update selected model
    onModelSelect(model); // Notify parent component of selection
  };

  return (
    <div>
      <h1>Model Selector</h1>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display errors */}
      {models && models.length > 0 ? (
        <>
          <label htmlFor="model-dropdown">Choose a model: </label>
          <select id="model-dropdown" onChange={handleChange} defaultValue="" style={{width:'90%'}}>
            <option value="" disabled>
              Select a model
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          {/* {selectedModel && (
            <div style={{ marginTop: "20px" }}>
              <h2>Model Details</h2>
              <p>
                <strong>ID:</strong> {selectedModel.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedModel.name}
              </p>
              <p>
                <strong>Description:</strong> {selectedModel.description}
              </p>
              <p>
              <strong>Modality:</strong> {selectedModel.architecture.modality}
              </p>
            </div>
          )} */}
        </>
      ) : (
        <p>Loading models...</p>
      )}
    </div>
  );
};

export default ModelDropdown;
