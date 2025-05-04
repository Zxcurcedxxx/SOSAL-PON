import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the multipart form data
    const formData = await request.formData()
    const messagesJson = formData.get("messages") as string
    const messages = JSON.parse(messagesJson)
    const files = formData.getAll("files") as File[]

    // Format messages for OnlySq API - ensure we're using the exact format from the example
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Process files if any
    const fileContents = []
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          // Read file content as text or base64 depending on file type
          const fileContent = await file.text().catch(() => {
            // If text() fails, try to read as ArrayBuffer and convert to base64
            return file.arrayBuffer().then((buffer) => {
              const bytes = new Uint8Array(buffer)
              let binary = ""
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i])
              }
              return btoa(binary)
            })
          })

          fileContents.push({
            name: file.name,
            type: file.type,
            content: fileContent,
          })
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
        }
      }

      // Add file information to the user's last message
      if (fileContents.length > 0 && formattedMessages.length > 0) {
        const lastUserMessageIndex = formattedMessages.length - 1
        formattedMessages[lastUserMessageIndex].content +=
          `\n\nAttached files:\n${fileContents.map((f) => `- ${f.name} (${f.type})`).join("\n")}`
      }
    }

    // Make request to OnlySq API using the format from the provided example
    const response = await fetch("https://api.onlysq.ru/ai/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        request: {
          messages: formattedMessages,
          // Include file information in meta
          meta:
            files.length > 0
              ? {
                  image_count: files.length,
                  files: fileContents.map((f) => ({
                    name: f.name,
                    type: f.type,
                  })),
                }
              : undefined,
        },
      }),
    })

    const data = await response.json()

    if (data.type === "error") {
      console.error("API error:", data)
      return NextResponse.json({ error: data.answer || "Failed to get response from AI service" }, { status: 400 })
    }

    // Extract the response content based on the API response structure
    let responseText = ""
    if (data.choices && data.choices[0] && data.choices[0].message) {
      responseText = data.choices[0].message.content
    } else if (data.text) {
      responseText = data.text
    } else if (data.answer) {
      responseText = data.answer
    } else {
      responseText = "Received response but couldn't extract text content."
    }

    return NextResponse.json({ text: responseText })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
