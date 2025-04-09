import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Trash2,
  Save,
  AlertCircle,
  Edit,
  Power,
  PowerOff,
  Key,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the schema for AI model configuration
const aiModelSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  provider: z.string().min(1, { message: "Provider is required" }),
  modelId: z.string().min(1, { message: "Model ID is required" }),
  apiKey: z.string().min(1, { message: "API Key is required" }),
  apiEndpoint: z.string().optional(),
  maxTokens: z.number().min(1).max(100000).default(2048),
  temperature: z.number().min(0).max(2).default(0.7),
  isActive: z.boolean().default(false),
  contextLength: z.number().min(1).max(100000).default(4096),
  costPerToken: z.number().min(0).default(0.0001),
});

type AIModel = z.infer<typeof aiModelSchema>;

// AI Provider options
const aiProviders = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google AI (Gemini)" },
  { value: "huggingface", label: "Hugging Face" },
  { value: "azure", label: "Azure OpenAI" },
  { value: "custom", label: "Custom Provider" },
];

// Model options by provider
const modelsByProvider: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ],
  anthropic: [
    { value: "claude-3-opus", label: "Claude 3 Opus" },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
    { value: "claude-3-haiku", label: "Claude 3 Haiku" },
    { value: "claude-2", label: "Claude 2" },
  ],
  google: [
    { value: "gemini-pro", label: "Gemini Pro" },
    { value: "gemini-ultra", label: "Gemini Ultra" },
  ],
  huggingface: [
    { value: "mistral-7b", label: "Mistral 7B" },
    { value: "llama-2-70b", label: "Llama 2 70B" },
    { value: "falcon-40b", label: "Falcon 40B" },
  ],
  azure: [
    { value: "azure-gpt-4", label: "Azure GPT-4" },
    { value: "azure-gpt-35-turbo", label: "Azure GPT-3.5 Turbo" },
  ],
  custom: [{ value: "custom-model", label: "Custom Model" }],
};

const AIModelConfiguration = () => {
  const [activeTab, setActiveTab] = useState("models-list");
  const [models, setModels] = useState<AIModel[]>([
    {
      id: "1",
      name: "Default GPT-4 Model",
      description: "OpenAI GPT-4 for general purpose use",
      provider: "openai",
      modelId: "gpt-4",
      apiKey: "sk-xxxxxxxxxxxxxxxxxxxx",
      maxTokens: 2048,
      temperature: 0.7,
      isActive: true,
      contextLength: 8192,
      costPerToken: 0.00006,
    },
    {
      id: "2",
      name: "Claude Assistant",
      description: "Anthropic Claude for customer support",
      provider: "anthropic",
      modelId: "claude-3-sonnet",
      apiKey: "sk-ant-xxxxxxxxxxxxxxxxxxxx",
      maxTokens: 4096,
      temperature: 0.5,
      isActive: false,
      contextLength: 100000,
      costPerToken: 0.00008,
    },
  ]);

  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<AIModel>({
    resolver: zodResolver(aiModelSchema),
    defaultValues: {
      name: "",
      description: "",
      provider: "openai",
      modelId: "gpt-4",
      apiKey: "",
      maxTokens: 2048,
      temperature: 0.7,
      isActive: false,
      contextLength: 8192,
      costPerToken: 0.00006,
    },
  });

  // Watch the provider to update model options
  const selectedProvider = watch("provider");

  // Update model options when provider changes
  useEffect(() => {
    if (selectedProvider && modelsByProvider[selectedProvider]?.length > 0) {
      setValue("modelId", modelsByProvider[selectedProvider][0].value);
    }
  }, [selectedProvider, setValue]);

  const handleAddModel = () => {
    setSelectedModel(null);
    reset({
      name: "",
      description: "",
      provider: "openai",
      modelId: "gpt-4",
      apiKey: "",
      maxTokens: 2048,
      temperature: 0.7,
      isActive: false,
      contextLength: 8192,
      costPerToken: 0.00006,
    });
    setActiveTab("model-editor");
    setShowApiKey(false);
  };

  const handleEditModel = (model: AIModel) => {
    setSelectedModel(model);
    reset(model);
    setActiveTab("model-editor");
    setShowApiKey(false);
  };

  const handleDeleteModel = (id: string) => {
    setModels(models.filter((model) => model.id !== id));
    setConfirmDelete(null);
  };

  const handleToggleActive = (id: string) => {
    setModels(
      models.map((model) =>
        model.id === id ? { ...model, isActive: !model.isActive } : model
      )
    );
  };

  const onSubmit = (data: AIModel) => {
    if (selectedModel) {
      // Update existing model
      setModels(
        models.map((model) =>
          model.id === selectedModel.id
            ? { ...data, id: selectedModel.id }
            : model
        )
      );
    } else {
      // Add new model
      setModels([...models, { ...data, id: Date.now().toString() }]);
    }
    setActiveTab("models-list");
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">AI Model Configuration</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="models-list">Models List</TabsTrigger>
          <TabsTrigger value="model-editor">Model Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="models-list" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">AI Models</h2>
            <Button onClick={handleAddModel}>
              <Plus className="mr-2 h-4 w-4" /> Add New Model
            </Button>
          </div>

          {models.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No AI models configured</AlertTitle>
              <AlertDescription>
                Add your first AI model to start using AI capabilities.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {models.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CardTitle className="flex items-center">
                          {model.name}
                        </CardTitle>
                        <Badge
                          variant={model.isActive ? "default" : "outline"}
                          className={model.isActive ? "bg-green-500" : ""}
                        >
                          {model.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(model.id || "")}
                          title={model.isActive ? "Deactivate" : "Activate"}
                        >
                          {model.isActive ? (
                            <PowerOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Power className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditModel(model)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setConfirmDelete(model.id || "")}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Provider</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {model.provider}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Model</p>
                        <p className="text-sm text-gray-500">{model.modelId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Max Tokens</p>
                        <p className="text-sm text-gray-500">
                          {model.maxTokens.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Temperature</p>
                        <p className="text-sm text-gray-500">
                          {model.temperature}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Context Length</p>
                        <p className="text-sm text-gray-500">
                          {model.contextLength.toLocaleString()} tokens
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cost Per Token</p>
                        <p className="text-sm text-gray-500">
                          ${model.costPerToken.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="model-editor">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedModel ? "Edit AI Model" : "Add New AI Model"}
              </CardTitle>
              <CardDescription>
                Configure AI model settings and connection details.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Model Name</Label>
                      <Input id="name" {...register("name")} />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" {...register("description")} />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <Select
                        value={watch("provider")}
                        onValueChange={(value) => setValue("provider", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiProviders.map((provider) => (
                            <SelectItem
                              key={provider.value}
                              value={provider.value}
                            >
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.provider && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.provider.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="modelId">Model</Label>
                      <Select
                        value={watch("modelId")}
                        onValueChange={(value) => setValue("modelId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelsByProvider[selectedProvider]?.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.modelId && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.modelId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex">
                        <Input
                          id="apiKey"
                          type={showApiKey ? "text" : "password"}
                          {...register("apiKey")}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={toggleShowApiKey}
                          className="ml-2"
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.apiKey && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.apiKey.message}
                        </p>
                      )}
                    </div>

                    {(selectedProvider === "custom" ||
                      selectedProvider === "azure") && (
                      <div>
                        <Label htmlFor="apiEndpoint">API Endpoint</Label>
                        <Input
                          id="apiEndpoint"
                          {...register("apiEndpoint")}
                          placeholder="https://api.example.com/v1"
                        />
                        {errors.apiEndpoint && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.apiEndpoint.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        {...register("maxTokens", { valueAsNumber: true })}
                      />
                      {errors.maxTokens && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.maxTokens.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="temperature">Temperature</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        {...register("temperature", { valueAsNumber: true })}
                      />
                      {errors.temperature && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.temperature.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contextLength">Context Length (tokens)</Label>
                      <Input
                        id="contextLength"
                        type="number"
                        {...register("contextLength", { valueAsNumber: true })}
                      />
                      {errors.contextLength && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.contextLength.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="costPerToken">Cost Per Token ($)</Label>
                      <Input
                        id="costPerToken"
                        type="number"
                        step="0.000001"
                        min="0"
                        {...register("costPerToken", { valueAsNumber: true })}
                      />
                      {errors.costPerToken && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.costPerToken.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="isActive"
                        checked={watch("isActive")}
                        onCheckedChange={(checked) =>
                          setValue("isActive", checked)
                        }
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("models-list")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {selectedModel ? "Update Model" : "Create Model"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this AI model? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteModel(confirmDelete || "")}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIModelConfiguration;
