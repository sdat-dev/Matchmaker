const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "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",
});
const openai = new OpenAIApi(configuration);



abc = async function() {
const response = await openai.createCompletion({
  model: "text-davinci-002",
  prompt: "Extract keywords from this text:ABSTRACT Abnormal glycosylation is a hallmark of many cancers that contributes to tumor growth and invasion. There are many protein receptors that are regulated abnormally in cancer due to mutations and/or alterations in glycosylation. Studies to link specific glycosylation changes to signaling outcomes have primarily focused on studies of individual receptors or specific pathways. Methods that can link forms of tumor-specific glycosylation to global effects on signaling pathway activation are needed to better identify potential new targets for therapeutics. To overcome this limitation we are employing the use of heterobifunctional molecule that will link cancer-specific glycosylation on protein receptors with a proximity- induced ubiquitination. To demonstrate the potential and applicability of this method we are using a novel scFv antibody that recognizes tumor-specific glycans present on ovarian cancer and glioblastoma cells that has been demonstrated to have excellent cell permeability. Combining the scFv with proteolysis targeting molecules will enable us to identify receptors and signaling changes using mass spectrometry methods. Successful completion of this project will establish a new platform useful for both basic science research and clinical therapeutic development.",
  temperature: 0.3,
  max_tokens: 200,
  top_p: 1.0,
  frequency_penalty: 0.8,
  presence_penalty: 0.0,
});
console.log(response.data.choices);
}


abc();