import { GoogleGenAI, Type } from "@google/genai";

// For Vite, environment variables exposed to the client must be prefixed with VITE_
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  // A check to ensure the API key is available. 
  // In a real deployed environment, this would be set.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

// Ensure ai is only initialized if API_KEY exists
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const model = 'gemini-2.5-flash';

const invoiceSchema = {
    type: Type.OBJECT,
    properties: {
        supplierName: { 
            type: Type.STRING,
            description: "Tên nhà cung cấp hoặc người bán.",
        },
        supplierTaxCode: { 
            type: Type.STRING,
            description: "Mã số thuế của nhà cung cấp. Nếu không có, trả về chuỗi rỗng.",
        },
        date: { 
            type: Type.STRING,
            description: "Ngày trên hóa đơn, định dạng YYYY-MM-DD. Nếu không rõ, trả về ngày hôm nay.",
        },
        lineItems: {
            type: Type.ARRAY,
            description: "Danh sách các hạng mục chi tiết trên hóa đơn.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { 
                        type: Type.STRING,
                        description: "Tên sản phẩm hoặc dịch vụ."
                    },
                    quantity: { 
                        type: Type.NUMBER,
                        description: "Số lượng. Mặc định là 1 nếu không rõ.",
                    },
                    unitPrice: { 
                        type: Type.NUMBER,
                        description: "Đơn giá của sản phẩm/dịch vụ. Nếu chỉ có tổng thành tiền cho hạng mục, hãy coi đó là đơn giá và số lượng là 1."
                    }
                },
                required: ['name', 'quantity', 'unitPrice']
            }
        }
    },
    required: ['supplierName', 'date', 'lineItems']
};


export const analyzeInvoiceImage = async (base64Image: string, mimeType: string) => {
    if (!ai) {
        throw new Error("API Key không được cấu hình. Không thể phân tích hình ảnh.");
    }

    try {
        const imagePart = {
            inlineData: {
                mimeType: mimeType,
                data: base64Image,
            },
        };

        const textPart = {
            text: "Phân tích hình ảnh hóa đơn này và trích xuất thông tin chi tiết theo cấu trúc JSON đã cho. Ưu tiên các hạng mục chi tiết (tên hàng, số lượng, đơn giá)."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: invoiceSchema,
            },
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("Trợ lý AI không trả về nội dung JSON hợp lệ.");
        }
        
        const parsedJson = JSON.parse(jsonText.trim());
        return parsedJson;

    } catch (error) {
        console.error("Lỗi khi phân tích hóa đơn bằng AI:", error);
        throw new Error("Trợ lý AI không thể đọc được hóa đơn này. Vui lòng thử lại hoặc nhập thủ công.");
    }
};


const getSystemInstruction = () => {
    return `You are an expert AI tax assistant for Vietnam's 2026 tax regulations.
    Your knowledge is based on the new rules. Answer questions clearly, concisely, and in Vietnamese.
    Do not provide financial advice, only explain the regulations.

    Key Rules Summary:
    1.  **Personal Income Tax (PIT) 2026:**
        *   Personal Deduction: 15.5 million VND/month.
        *   Dependent Deduction: 6.2 million VND/month.
        *   Dependent Income Limit: A dependent's average monthly income must NOT exceed 1 million VND. If it does, they are not eligible for deduction. This is a critical risk point.
        *   Tax Brackets: 5 new brackets starting at 5% for income up to 10M VND/month.
    2.  **Household Business (HKD) Tax 2026:**
        *   Lump-sum tax is abolished. All HKDs must declare revenue.
        *   Group 1 (Revenue <= 200M VND/year): Exempt from VAT and PIT, but must still declare revenue.
        *   Group 2 (Revenue 200M - 3B VND/year): Pay VAT and PIT as a percentage of revenue, based on business category.
        *   Group 3 (Revenue > 3B VND/year): Must use complex accounting methods like a full enterprise.
    3.  **E-commerce (TMĐT) Tax:**
        *   Marketplaces (Shopee, Lazada) are required to withhold and pay tax on behalf of sellers.
        *   Goods: 1% VAT + 0.5% PIT.
        *   Services: 5% VAT + 2% PIT.
        *   Sellers with total annual income under 200M VND can file for a tax refund for the amount withheld by marketplaces.

    When asked a question, refer to these rules to provide an accurate answer. For example, if a user asks "Mẹ tôi lương hưu 4 triệu, tôi đăng ký NPT được không?", you should respond that based on the 1 million VND income limit, she is not eligible and explain the potential risk of tax recovery.
    `;
};


export const streamChatResponse = async (
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    newMessage: string
) => {
    try {
        if (!ai) {
             throw new Error("API Key không được tìm thấy. Vui lòng cấu hình API Key trong môi trường của bạn để sử dụng Trợ lý AI.");
        }
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: getSystemInstruction(),
            },
            history: history
        });

        const result = await chat.sendMessageStream({ message: newMessage });
        return result;

    } catch (error) {
        console.error("Error streaming chat response:", error);
        if (error instanceof Error && (error.message.includes('API key') || error.message.includes('400'))) {
             throw new Error("Lỗi xác thực: API Key không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra lại cấu hình môi trường của bạn.");
        }
        throw new Error("Không thể kết nối với Trợ lý AI. Vui lòng thử lại sau.");
    }
};
