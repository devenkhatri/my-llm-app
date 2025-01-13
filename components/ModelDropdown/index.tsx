import { Select, SelectItem } from "@nextui-org/react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch models from the API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
        console.log("****** All Models", output.models)
      } catch (error: any) {
        setError(error.message); // Handle errors
        setIsLoading(false);
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
      <div className="text-primary text-lg">Model Selector</div>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display errors */}

      <Select
        className="w-full"
        isRequired
        color="primary"
        variant="bordered"
        items={models}
        label="Choose the LLM Model"
        isLoading={isLoading}     
        onChange={handleChange}           
      >
        {(model) => <SelectItem key={model.id}>{model.name}</SelectItem>}
      </Select>
    </div>
  );
};

export default ModelDropdown;
