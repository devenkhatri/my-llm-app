import { Autocomplete, AutocompleteItem, Select, SelectItem, Switch } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import Checking from "../test";

type Model = {
  pricing: any;
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
  const [freeModels, setFreeModels] = useState<Model[]>([]); // Stores only free models fetched from the API
  const [selectedModel, setSelectedModel] = useState<Model | null>(null); // Stores the currently selected model
  const [error, setError] = useState<string | null>(null); // Stores any error messages
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFreeOnly, setIsFreeOnly] = React.useState(true);

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
        var filtered = output.models.data.filter((m: any) => m.pricing.prompt <= 0);
        setFreeModels(filtered);
        setIsLoading(false);
        console.log("****** All Models", output.models.data)
        console.log("****** All Free Models", filtered)
      } catch (error: any) {
        setError(error.message); // Handle errors
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Handle dropdown change
  const handleChange = (modelId: any) => {
    // const modelId = event.target.value;
    const model = models.find((m) => m.id === modelId) || null;
    setSelectedModel(model); // Update selected model
    onModelSelect(model); // Notify parent component of selection
  };

  const handleFreeOnly = () => {
    if(isFreeOnly) {
      setModels(models)
    }
    setIsFreeOnly(!isFreeOnly);
  }

  return (
    <div>
      <div className="text-primary text-lg">Model Selector</div>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display errors */}
      {/* <Checking /> */}
      <div className="flex flex-col gap-2">
        <Autocomplete
          className="w-full"
          isRequired
          color="primary"
          variant="bordered"
          defaultItems={isFreeOnly?freeModels:models}
          label="Choose the LLM Model"
          isLoading={isLoading}
          scrollShadowProps={{
            isEnabled: false,
          }}
          showScrollIndicators={true}
          onSelectionChange={handleChange}
        >
          {(model) => <AutocompleteItem key={model.id}>{model.name}</AutocompleteItem>}
        </Autocomplete>
        {!isLoading &&
          <Switch size="sm" isSelected={isFreeOnly} onValueChange={handleFreeOnly}>
            Show only Free LLM?
          </Switch>}
      </div>
    </div>
  );
};

export default ModelDropdown;
