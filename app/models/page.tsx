import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ModelsPage() {
  const models = [
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and efficient language model for general-purpose tasks",
      capabilities: ["Text generation", "Summarization", "Question answering"],
      provider: "OpenAI",
      tokenLimit: 4096,
    },
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Advanced language model with improved reasoning and knowledge",
      capabilities: ["Complex reasoning", "Code generation", "Creative writing"],
      provider: "OpenAI",
      tokenLimit: 8192,
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      description: "Anthropic's most capable model with strong reasoning abilities",
      capabilities: ["Detailed responses", "Nuanced understanding", "Helpful assistance"],
      provider: "Anthropic",
      tokenLimit: 100000,
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Available Models</h1>
      <p className="text-gray-500 mb-8">Browse and select from our collection of AI models</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{model.name}</CardTitle>
                <Badge variant="outline">{model.provider}</Badge>
              </div>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium">Capabilities:</div>
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((capability) => (
                    <Badge key={capability} variant="secondary">
                      {capability}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm mt-4">
                  <span className="font-medium">Token limit:</span> {model.tokenLimit.toLocaleString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/?model=${model.id}`}>Chat with {model.name}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
