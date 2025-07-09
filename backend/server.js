// server.js (最终版本，使用 fetch)

// 1. 引入库 (我们不再需要 'openai' 库了)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // 兼容node-fetch
const cheerio = require('cheerio'); // 用于解析HTML
const app = express();
const port = process.env.PORT || 3000;

// 设置中间件
app.use(cors());
app.use(express.json());

// 创建API接口
app.post('/api/polish', async (req, res) => {
  console.log("收到前端请求，开始处理...");

  // 从环境变量中获取API密钥
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("错误：未在.env文件中找到API密钥");
    return res.status(500).json({ error: '服务器未配置API密钥' });
  }

  try {
    const { originalText } = req.body;
    if (!originalText) {
      return res.status(400).json({ error: '没有提供原始文本' });
    }
    
    // 准备Prompt，保持不变
    const prompt = `你是一位资深的法律文书专家。请将以下文本进行语言润色，使其在保持原意不变的前提下，语言风格更加专业、严谨、客观和书面化。请直接返回润色后的文本，不要包含任何额外的解释或开场白。\n\n原文：\n"${originalText}"\n\n润色后的文本：`;

    // ------------------- 手动构造请求 -------------------

    // a. 定义请求的完整URL
    const url = "https://api.siliconflow.cn/v1/chat/completions";

    // b. 定义请求体 (Payload)
    const body = {
      model: "baidu/ERNIE-4.5-300B-A47B", // 我们使用官方示例中的这个模型名
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.5,
    };

    // c. 定义请求头 (Headers)
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };

    // ----------------------------------------------------

    console.log("正在向硅基流动API发送请求...");
    // d. 使用 fetch 发送请求
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body) // fetch需要手动将对象转换为JSON字符串
    });

    // e. 检查响应状态
    if (!response.ok) {
      // 如果API返回错误，读取错误详情并抛出
      const errorText = await response.text();
      console.error(`API返回错误: 状态码 ${response.status}`, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    // f. 解析成功的响应
    const responseData = await response.json();
    console.log("成功从API获取响应！");

    const polishedText = responseData.choices[0].message.content;
    res.json({ polishedText });

  } catch (error) {
    // 捕获所有在try块中发生的错误
    console.error('处理请求时发生错误:', error.message);
    res.status(500).json({ error: '调用大模型API时出错' });
  }
});

// 新增：写作框架API接口
app.post('/api/framework', async (req, res) => {
  console.log("收到前端写作框架请求，开始处理...");

  const apiKey = process.env.DEEPSEEK_FRAME_API_KEY;
  if (!apiKey) {
    console.error("错误：未在.env文件中找到写作框架API密钥");
    return res.status(500).json({ error: '服务器未配置写作框架API密钥' });
  }

  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: '没有提供主题或案情' });
    }
    // 1. 新prompt：让LLM输出写作框架+检索关键词
    const prompt = `你是一位法律写作专家，请根据以下主题或案情，用标准的文档格式（不要用markdown格式）生成一份详细的法律文书写作框架（包括主要结构、各部分要点、建议论证思路），并在最后单独列出本案可用于检索的关键词（5个以内，中文空格分隔，格式为"检索关键词：xxx xxx xxx"），不要解释。\n\n主题/案情：\n"${topic}"\n\n写作框架：`;
    const url = "https://api.siliconflow.cn/v1/chat/completions";
    const body = {
      model: "baidu/ERNIE-4.5-300B-A47B",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      temperature: 0.5,
    };
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }
    const responseData = await response.json();
    const frameworkRaw = responseData.choices[0].message.content;
    // 用正则提取关键词
    const keywordMatch = frameworkRaw.match(/检索关键词[:：]\s*([\u4e00-\u9fa5a-zA-Z0-9,， ]+)/);
    let keywords = '';
    if (keywordMatch) {
      keywords = keywordMatch[1].replace(/，/g, ' ').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    }
    console.log('LLM原始返回内容:', frameworkRaw);
    // 框架内容去掉关键词行
    const framework = frameworkRaw.replace(/检索关键词[:：][\u4e00-\u9fa5a-zA-Z0-9,， ]+/, '').trim();
    res.json({ framework, keywords });
  } catch (error) {
    console.error('处理写作框架请求时发生错误:', error.message);
    res.status(500).json({ error: '调用写作框架大模型API时出错' });
  }
});

app.listen(port, () => {
  console.log(`后端服务器正在 http://localhost:${port} 上运行`);
});
