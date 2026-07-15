import { NextResponse } from 'next/server';
import { searchBookSegments } from '@/lib/actions/book.actions';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Vapi sends tool calls in message.toolCalls or message.toolCallList
    const toolCalls = body.message?.toolCalls || body.message?.toolCallList || [];

    const results = await Promise.all(
      toolCalls.map(async (toolCall: any) => {
        const functionName = toolCall.function?.name;
        
        // Handle both 'search_book' and 'search book' as specified in the issue
        if (functionName === 'search_book' || functionName === 'search book') {
          let args = toolCall.function.arguments;
          
          // Arguments can be an object or a JSON string
          if (typeof args === 'string') {
            try {
              args = JSON.parse(args);
            } catch (e) {
              console.error('Failed to parse tool call arguments:', e);
              return {
                toolCallId: toolCall.id,
                result: "invalid arguments format"
              };
            }
          }
          
          const bookId = args.bookId;
          const query = args.query;
          
          if (!bookId || !query) {
            return {
              toolCallId: toolCall.id,
              result: "bookId and query are required"
            };
          }

          // Call searchBookSegments with bookId, query, and 3 (top three matching segments)
          const searchResult = await searchBookSegments(bookId, query, 3);
          
          if (searchResult.success && Array.isArray(searchResult.data) && searchResult.data.length > 0) {
            // Combine match segments and their contents into a single string, separated by double new lines
            const combinedContent = searchResult.data
              .map((segment: any) => segment.content)
              .join('\n\n');
            
            return {
              toolCallId: toolCall.id,
              result: combinedContent,
            };
          } else {
            // If no matches are found, return "no information found about this topic"
            return {
              toolCallId: toolCall.id,
              result: "no information found about this topic",
            };
          }
        }
        return null;
      })
    );

    // Vapi expects a response with a results array
    return NextResponse.json({
      results: results.filter((r) => r !== null),
    });
  } catch (error) {
    console.error('Error handling Vapi tool call:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
