## Indroduction
The idea of FirstHelp blooms from the lack of availability of the the appropriate healthcare advices in second and third world countries. Even in the first world countries like the united states, the hassle of getting an appointment is evident. In such a scenario, we propose the use of FirstHand, an AI based product that facilitates the telemedicine and early stage diagnostics and information gathering in order to alleviate the workload of the doctors and thus helping them giving their valuable times. It is neither an AI to replace a doctor, nor it can. Its just here to assist them during the whole lifecycle of patient treatment.

## What it does
FirstHand is an AI-based web application that upon account creation gather crucial medicinal informatics and provides two primary features.

An AI based telemedicine chat interface in order to help the individuals with trivial or minimal attention requiring problems a quick lifestyle change or basic quick-remedies. The telemedicine service can ask questions pertaining to the symptoms before reaching a final conclusion and also suggest emergency care and tests if found necessary.

The FirstHand also offers a platform to ease the Doctor's workload by asking the patients prior questions regarding their complaints in order to reduce the trivial workload for the doctors. The platform also provides the feature where the doctors can query the previous medical records of the patient present in the dataset using a natural language prompt in order to better understand his background for effective diagnoses of the underlying medical conditions.

## How is it built?

![Blank diagram (14)](https://github.com/user-attachments/assets/23d7db2e-9157-4ee0-be20-8bb15e4db7f0)

Development of the AI-telemedicine: The development of the AI telemedicine is done using 2 main components, Google's Gemini and NLX. The development began with the fine-tuning of a Gemini-1.5-flash on a red-teamed dataset consisting of more than 20000+ samples. The NLX on the other hand was used to facilitate the development of the conversational chat interface.

Development of the Early-diagnostics systems and querying system: The early diagnostics systems was developed using the Claude-3.5-Sonnet. The developed system uses the data captured in the MongoDB and the symptoms to answer the questions about the patients on the Doctor's portal.
