const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(userQuery) {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [await uploadToGemini("dump.csv", "text/csv")];

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Many existing Dams and Reservoirs are built several decades ago with certain intended purposes. However, due to increasing population, change in extreme climatic conditions, improvement in agricultural practices there is a necessity for re-evaluation of the current infrastructure and water management practices. Description It is likely that existing dams get silted up over time and are unable to store sufficient water. Due to which there will be a shift in the command area or the cropping pattern. It is also a known fact that changing climate issues is also posing a problem, due to which there is need to review the agricultural requirement. The existing dams and reservoirs are increasingly vulnerable to the adverse climate change and shifts in agricultural practices. These changes can lead to structural stress, altered water availability and inefficiencies in water distribution and usage. There is an urgent need to develop and implement new monitoring and water management models to ensure the safety, efficiency, and sustainability of these critical infrastructures. Expected Solution This problem will address the safety and resilience of dams and reservoirs against climate - induced risks, enhance water resources management and optimally support the agricultural needs and environmental sustainability. There will also be a long-term planning of water infrastructure in the face of climate and agricultural changes. This needs work on the Hydrological impact due to changes in the climatic conditions, which in turn effect the water demand in the command area. The changing technology, and adaption of new agricultural practices should be taken into account. It is essential to implement a decision support system along with predictive analysis that provide insights to the water managers and policy makers on real-time data.\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "The problem you've described highlights the urgent need to modernize dam and reservoir management to cope with evolving challenges. Here's a breakdown of the problem and potential solutions, structured for clarity:\n\n**Problem:** Aging dam infrastructure and changing conditions threaten water security and agricultural productivity.\n\n* **Sedimentation:** Dams lose storage capacity over time due to sediment buildup, reducing their effectiveness for water supply and flood control.\n* **Climate Change Impacts:** Altered precipitation patterns, increased evaporation, and more frequent extreme weather events (droughts and floods) strain existing water resources and infrastructure.\n* **Shifting Agricultural Demands:**  Population growth, improved agricultural practices, and changing crop patterns increase water demand, potentially exceeding existing supply.\n* **Infrastructure Vulnerability:**  Older dams may not be designed to withstand the impacts of climate change, increasing the risk of structural failure.\n* **Inefficient Water Management:** Current practices may not be optimized for the current and future demands, leading to water waste and shortages.\n\n\n**Solution: A Multi-pronged Approach**\n\nThe solution requires a comprehensive strategy encompassing infrastructure assessment, improved monitoring, advanced modeling, and adaptive management practices.\n\n1. **Assessment and Rehabilitation:**\n\n* **Sediment Management:** Implement strategies to remove accumulated sediment or minimize future deposition. This could include dredging, flushing, or watershed management practices.\n* **Dam Safety Inspections:** Conduct thorough assessments of existing dams to identify structural vulnerabilities and prioritize necessary repairs or upgrades.\n* **Infrastructure Modernization:**  Upgrade spillways, outlet works, and other components to handle increased flood flows and ensure long-term safety.\n\n2. **Enhanced Monitoring and Data Collection:**\n\n* **Real-time Monitoring Systems:** Deploy sensors to monitor water levels, flow rates, dam stability, and environmental conditions (e.g., rainfall, temperature).\n* **Hydro-meteorological Networks:** Expand and improve weather monitoring networks to provide accurate and timely data for forecasting and decision-making.\n* **Remote Sensing:** Utilize satellite imagery and aerial surveys to monitor land use changes, snowpack, and vegetation health in the watershed.\n\n3. **Advanced Modeling and Predictive Analysis:**\n\n* **Hydrological Modeling:** Develop sophisticated hydrological models to simulate the impacts of climate change and land use changes on water availability.\n* **Water Demand Forecasting:**  Develop models to predict future water demands based on population growth, agricultural practices, and economic development.\n* **Reservoir Operation Optimization:** Use advanced algorithms and optimization techniques to determine the optimal release schedules from reservoirs to meet multiple objectives (e.g., water supply, flood control, hydropower generation, environmental flows).\n\n4. **Adaptive Management and Decision Support Systems:**\n\n* **Decision Support System (DSS):** Develop a DSS that integrates real-time data, model outputs, and expert knowledge to provide decision-makers with actionable information.\n* **Scenario Planning:**  Explore a range of future climate and demand scenarios to develop robust water management strategies.\n* **Stakeholder Engagement:**  Engage with local communities, farmers, and other stakeholders to ensure that water management decisions are equitable and sustainable.\n* **Policy and Regulatory Frameworks:** Update water allocation policies and regulations to reflect changing conditions and promote efficient water use.\n\n\n**Technology Integration:**\n\n* **Cloud Computing:** Utilize cloud-based platforms for data storage, processing, and model development.\n* **Machine Learning:** Apply machine learning techniques to improve forecasting accuracy and optimize reservoir operations.\n* **Internet of Things (IoT):** Integrate IoT devices for real-time monitoring and automated control of water infrastructure.\n\n\nBy implementing these solutions, water managers can ensure the long-term safety, resilience, and sustainability of dam and reservoir systems, while also supporting the evolving needs of agriculture and the environment.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "As a side utility to the project based on the above mentioned project, I''d like to train you in order to give answer to basic questions based on the history of dams in India, their climatic conditions and geographical states",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: 'I\'m ready to learn about the history of dams in India, their climatic conditions, and geographical states. Please provide me with information, and I\'ll do my best to absorb and organize it.  I can handle various formats like:\n\n* **Textual descriptions:**  Provide information in paragraph form, bullet points, or lists.\n* **Tables:** Share data in tabular format for easy organization and retrieval.\n* **Links to resources:** Point me towards reliable online resources like government websites, academic papers, or reputable news articles.\n\nThe more structured and detailed the information, the better I can learn and answer your questions.\n\nTo make the learning process more efficient, please consider focusing on specific areas or time periods. For example, instead of "history of all dams," we could start with "history of major dams in South India during the British Raj."  This will allow me to build a solid foundation and gradually expand my knowledge.\n\nOnce I have a good understanding of the information, you can test my knowledge with various questions.  I\'m eager to learn!\n',
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "do you already know about current dams in India" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I have some general knowledge about dams in India, including the names of some major dams like the Tehri Dam, Bhakra Nangal Dam, and Sardar Sarovar Dam. I also know that India has a large number of dams, and they play a crucial role in irrigation, hydropower generation, and flood control.\n\nHowever, my knowledge is not exhaustive or detailed. I don't have specific information readily available about all the current dams in India, including their exact locations, construction dates, capacities, catchment areas, or the current status of their operation.  I can access and process information from the real world through Google Search and keep my response consistent with search results.  Therefore, I can look up specific dams if you have questions about them.  But for a comprehensive overview or detailed information, it's best to provide me with relevant resources or ask more specific questions.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "tell me about the climatic caonditions near Dams on Sutluj river",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "The Sutlej River, originating in the Tibetan Plateau, flows through a diverse range of climatic conditions before joining the Indus River in Pakistan.  The climate near dams on the Sutlej can be broadly categorized, but it varies significantly depending on the elevation and specific location.\n\n* **Upper Reaches (Tibet and Himachal Pradesh):**  This region experiences a cold desert climate, characterized by low precipitation, high diurnal temperature variations, and long winters with heavy snowfall. Dams in this area, such as the Nathpa Jhakri Dam, are often situated in high-altitude mountainous terrain.\n\n* **Middle Reaches (Himachal Pradesh and Punjab):**  As the Sutlej descends, the climate transitions to a more temperate zone.  Summers are warm, and winters are cool. Rainfall is higher than in the upper reaches, primarily occurring during the monsoon season (July-September).  The Bhakra Nangal Dam, one of India's largest dams, is located in this region.\n\n* **Lower Reaches (Punjab and Rajasthan/Pakistan):**  This area experiences a hot desert climate. Summers are extremely hot and dry, while winters are mild. Rainfall is scarce and highly variable.  The Harike Barrage, though not strictly a dam, is a significant water management structure in this zone.\n\n**Specific climatic conditions influencing dam operations include:**\n\n* **Snowmelt:**  Snowmelt from the Himalayas is a major source of water for the Sutlej, especially during the spring and summer months. This influences reservoir inflow patterns and water availability.\n* **Monsoon Rainfall:**  The monsoon season brings significant rainfall to the middle reaches, which can lead to increased reservoir levels and the need for flood control measures.\n* **Evaporation:**  High temperatures in the lower reaches lead to significant evaporation losses from reservoirs and canals, affecting water availability for irrigation and other uses.\n* **Glacial Lake Outburst Floods (GLOFs):**  The upper reaches of the Sutlej are prone to GLOFs, which can pose a risk to dam infrastructure and downstream communities.\n\n\nIt's important to note that climate change is impacting the Sutlej River basin, with changes observed in snowmelt patterns, monsoon rainfall, and glacier retreat.  These changes have implications for dam operations and water management in the region.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "tell me about the geographical and climatic conditions near chamera dam",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "The Chamera Dam is located on the Ravi River in the Chamba district of Himachal Pradesh, India.  Here's a look at the geographical and climatic conditions of the area:\n\n**Geographical Conditions:**\n\n* **Mountainous Terrain:** The dam is situated in a rugged, mountainous region of the Himalayas, characterized by steep slopes, deep valleys, and narrow gorges.  The elevation of the dam site is approximately 700 meters (2,300 feet) above sea level.\n* **Ravi River Basin:** The dam is built on the Ravi River, a major tributary of the Indus River. The river flows through a complex network of valleys and gorges in this region.\n* **Seismic Zone:** The area lies in a seismically active zone, making earthquake-resistant design and construction crucial for the dam.\n* **Forest Cover:** The surrounding area has significant forest cover, although deforestation and land use changes are ongoing concerns.\n\n**Climatic Conditions:**\n\n* **Subtropical Highland Climate:** The region experiences a subtropical highland climate, with distinct wet and dry seasons.\n* **Monsoon Season:**  The monsoon season (July-September) brings heavy rainfall, which is the primary source of water for the Ravi River. This period is crucial for reservoir filling.\n* **Winters:** Winters (November-March) are cold, with temperatures often dropping below freezing. Snowfall is common at higher elevations.\n* **Summers:** Summers (April-June) are relatively mild and pleasant, with temperatures ranging from moderate to warm.\n* **Temperature Variation:**  The region experiences significant temperature variations due to the altitude and topography.\n* **Microclimates:**  The complex terrain creates microclimates, with variations in temperature and precipitation within short distances.\n\n**Impact of Climate Change:**\n\nLike many Himalayan regions, the area around the Chamera Dam is experiencing the effects of climate change. Changes in precipitation patterns, increased temperatures, and glacial melt are influencing river flows and posing challenges for water resource management.\n\nUnderstanding these geographical and climatic conditions is essential for the safe and efficient operation of the Chamera Dam and for managing the water resources of the Ravi River basin.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Dams near Bangalore" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "While Bangalore itself doesn't have large dams within its city limits, there are several important reservoirs and dams located in the surrounding districts that supply water to the city.  These include:\n\n* **Tippagondanahalli Reservoir (T G Halli):**  Located on the Arkavathi River, this is one of the oldest reservoirs supplying water to Bangalore.  It's not a large dam, but it plays a significant role.\n\n* **Hesaraghatta Lake:** Though not strictly a dam, this lake serves as a reservoir and is an important source of water for Bangalore.\n\n* **Krishna Raja Sagara (KRS) Dam:** While further away in Mysore district, KRS Dam on the Cauvery River is a major source of water for irrigation and drinking water in the region, indirectly benefiting Bangalore.  Water from the Cauvery is pumped to Bangalore through a complex network of canals and pipelines.\n\n* **Kabini Reservoir:** Also located on the Cauvery River in Mysore district, Kabini Reservoir contributes to the Cauvery water supply system that benefits Bangalore.\n\n* **Harangi Reservoir:** Situated in Kodagu district on the Harangi River (a tributary of the Cauvery), this reservoir contributes to the overall Cauvery water system.\n\n\nIt's important to note that Bangalore relies on a complex interconnected network of reservoirs and pipelines for its water supply.  The dams and reservoirs mentioned above, along with others in the Cauvery basin, play a vital role in meeting the city's water demands.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "gobind sagar reservoir" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "The Gobind Sagar Reservoir is a large reservoir located in Bilaspur, Himachal Pradesh, India.  It was created by the Bhakra Dam on the Sutlej River. Here's some key information about it:\n\n* **Size and Capacity:**  It's one of the largest reservoirs in India, with a surface area of approximately 170 square kilometers (66 square miles) and a total capacity of around 9.34 billion cubic meters (7.56 million acre-feet).\n\n* **Purpose:** The reservoir serves multiple purposes, including:\n    * **Irrigation:**  It provides irrigation water for a vast area of agricultural land in Punjab, Haryana, and Rajasthan.\n    * **Hydropower Generation:**  The Bhakra Dam's powerhouse generates a significant amount of hydroelectric power.\n    * **Drinking Water Supply:**  It contributes to the drinking water supply of several towns and cities in the region.\n    * **Flood Control:**  The reservoir helps regulate the flow of the Sutlej River and mitigate downstream flooding.\n\n* **Bhakra Dam:**  The Bhakra Dam, which forms the Gobind Sagar Reservoir, is a concrete gravity dam and one of the highest gravity dams in the world.\n\n* **Naming:** The reservoir is named after Guru Gobind Singh, the tenth Sikh guru.\n\n* **Tourism:** The reservoir and the surrounding area are popular tourist destinations, offering boating, fishing, and scenic views.\n\n* **Environmental Impact:** The creation of the reservoir has had significant environmental and social impacts, including the displacement of communities and changes in the downstream river ecosystem.\n\n* **Challenges:**  Like many large reservoirs, Gobind Sagar faces challenges related to sedimentation, water quality, and the impacts of climate change.\n\n\nThe Gobind Sagar Reservoir plays a crucial role in the water and energy security of northern India.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: 'This data table provides some key statistics about the Gobind Sagar Reservoir:\n\n* **id:** 1 (This is likely just an identifier for the database)\n* **name:** Gobind Sagar\n* **latitude:** 30 (Likely an approximation.  More precise coordinates would include minutes and seconds.)\n* **longitude:** 75 (Also likely an approximation.)\n* **status:** good (This suggests the dam is in operational condition, although the criteria for "good" are not defined here.)\n* **last_maintenance:** 0001-01-01 00:00: (This date likely indicates missing or placeholder data for the last maintenance date.)\n* **water_cover:** 222.4300079 (Likely in square kilometers, but the units are not specified.)\n* **mean_depth:** 35.7 (Units not specified, but likely meters.)\n* **gross_volume:** 1.23214E+11 (This is scientific notation, meaning 1.23214 * 10^11.  The units are not specified, but given the other values, it\'s likely cubic meters.)\n\n\nIt\'s important to note that without specific units and context for the "status" and "last_maintenance" fields, the interpretation of this data is limited.  It\'s also crucial to remember that these are likely snapshot figures, and reservoir levels and volumes fluctuate significantly throughout the year.\n',
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "take this data to train yourself. As we proceed further you will be give more such data to further train and you are expected to take this data into account while answering the further queries\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I have stored this data about the Gobind Sagar Reservoir. I will use this information to inform my responses to future queries, and I'm prepared to integrate additional data as you provide it.  Please let me know when you're ready to continue.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {text: "tell me when was the last maintenance of gobind sagar reservoir\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "The data I was provided earlier indicated \"0001-01-01 00:00:\" for the last maintenance date of the Gobind Sagar Reservoir. This is clearly a placeholder or an indication of missing data.  I cannot determine the actual last maintenance date from this.  To get the correct information, you would need to consult official sources like the Bhakra Beas Management Board (BBMB) or other relevant Indian government agencies.\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "do not say that you can't determine. if its present in the data you've been trained on then provide it as it is since it is real time data only"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "The last maintenance date recorded in the data I have is 0001-01-01 00:00.  However, as I mentioned previously, this is almost certainly a placeholder for missing data and not a reliable date.  While I will use the data I'm given, it's important to acknowledge when that data is likely inaccurate or incomplete.\n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "do not acknowledge this"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "The last maintenance date in my records is 0001-01-01 00:00.\n"},
        ],
      }
    ],
  });

  const result = await chatSession.sendMessage(userQuery);
  return result.response.text();
}

function getFirstSentence(text) {
    // Use a regular expression to match up to the first period, question mark, or exclamation mark
    const match = text.match(/(.*?[.!?])\s/);
    return match ? match[1] : text; // Return the match or the full text if no match
  }

app.get("/", (req, res) => {
  res.send("Gemini API Server is running!");
});

app.post("/query", async (req, res) => {
  var { userQuery } = req.body;

  if (!userQuery) {
    return res
      .status(400)
      .json({ error: "Missing userQuery in query parameters" });
  }

  try {
   
    r = await run(userQuery);
    userQuery = userQuery + "Do not acknowledge missing or inaccurate data since this is a prototype for a hackathon";
    console.log(r);



    res.json({
      message: "Query processed successfully",
      response: r,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to process query", details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
