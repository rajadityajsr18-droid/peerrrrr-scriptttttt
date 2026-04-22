export const mockUser = {
  id: 'u1',
  name: 'Aditya',
  role: 'B.Tech CSE Scholar',
  avatar: null
};

export const reviewers = {
  mentor: { id: 'u2', name: 'Dr. R. Sharma', role: 'Faculty Mentor', avatar: null },
  peer: { id: 'u3', name: 'Kabir Singh', role: 'Senior Peer', avatar: null }
};

export const initialDocs = [
  {
    id: 'd1',
    title: 'LPU Delegation at the Global AI Summit: A Retrospective',
    author: 'Aditya',
    status: 'review', 
    currentVersion: 2,
    versions: [
      {
        v: 1,
        note: 'Initial Draft',
        timestamp: '2026-04-10T10:00:00Z',
        author: 'Aditya',
        blocks: [
          { id: 'b1', section: 'Introduction', text: 'Lovely Professional University (LPU) recently sponsored a delegation of 50 top engineering students to attend the Global AI Summit.' }
        ]
      },
      {
        v: 2,
        note: 'Expanded details on projects and industry networking',
        timestamp: '2026-04-15T14:20:00Z',
        author: 'Aditya',
        blocks: [
          { id: 'b1', section: 'Introduction', text: 'This year, Lovely Professional University (LPU) proudly sent a meticulously selected delegation of 50 top engineering scholars from the School of Computer Science and Engineering to the highly acclaimed Global AI Summit in Silicon Valley. The objective was to immerse students in the bleeding edge of artificial intelligence, exposing them to enterprise-level machine learning architectures, advanced neural network design, and fostering global academic-industry ties that will define the next decade of software engineering.' },
          { id: 'b2', section: 'Introduction', text: 'Over the course of three days, the delegation engaged in exhaustive workshops, keynote sessions, and intensive networking events, representing the robust research culture fostered within LPU. Discussions spanned across generative models, ethical AI deployment, large language model training pipelines, and the socio-economic impacts of automated cognition. The LPU delegation successfully presented their own research abstracts, competing against top-tier scholars from around the globe and cementing the university’s status as a premier hub for technological innovation.' },
          { id: 'b3', section: 'Project Showcase: Autonomous Systems', text: 'The summit underscored the importance of academic-industry partnerships. Our LPU cohort stood out by presenting applied AI projects, most notably a collaborative autonomous robotics framework developed entirely within the campus incubation center. This framework utilized edge computing and lightweight neural networks to enable drones to navigate densely populated urban environments without relying on GPS, solving a critical roadblock in modern urban delivery logistics.' },
          { id: 'b4', section: 'Project Showcase: Autonomous Systems', text: 'The software architecture, built primarily using PyTorch and deployed on edge TPU devices, attracted significant attention from venture capitalists who noted the viability of the project for immediate commercial adaptation.' },
          { id: 'b5', section: 'Industry Feedback & Networking', text: 'Several global tech leaders, including senior researchers from top-tier AI labs, commended the students on their robust theoretical foundations and impressive problem-solving agility. These interactions resulted in three direct summer internship offers for our junior year scholars and a tentative agreement to establish a joint research laboratory at LPU.' },
          { id: 'b6', section: 'Conclusion', text: 'The Global AI Summit proved to be a transformative experience. It not only validated the rigorous curriculum at LPU but also provided actionable insights into the future trajectory of AI development. Moving forward, the university must aggressively integrate these insights into upcoming syllabus revisions.' }
        ]
      }
    ],
    rubric: { rigor: 9.5, originality: 8.0, formatting: 9.0 },
    integrity: { plagiarism: 2, aiRisk: 'Low' },
    facultyFeedback: 'The project details are incredibly thorough. Moving forward, ensure you cite the specific grants and lab resources you utilized during development.',
    comments: [
      {
        id: 'c1',
        blockId: 'b3',
        author: reviewers.mentor,
        text: "Please mention the exact name of the incubation center (e.g., LPU Startup School or Student Entrepreneurship Cell) to give proper university context and acknowledge their funding support.",
        resolved: false,
        timestamp: '2026-04-18T14:30:00Z',
        replies: [
          {
            id: 'r1',
            author: mockUser,
            text: 'Noted! I will explicitly mention the incubation grant provided by the LPU Innovation Hub in the next revision.',
            timestamp: '2026-04-19T09:15:00Z'
          }
        ]
      },
      {
        id: 'c2',
        blockId: 'b5',
        author: reviewers.peer,
        text: "This is a massive achievement! Do we have a specific quote from any of the researchers or VCs? Integrating a direct quote would make this section extremely compelling for the university newsletter.",
        resolved: false,
        timestamp: '2026-04-18T15:00:00Z',
        replies: []
      }
    ]
  },
  {
    id: 'd2',
    title: 'Green Campus Initiatives: Expanding Solar Coverage at LPU',
    author: 'Priya Mehra',
    status: 'draft',
    currentVersion: 1,
    versions: [
      {
        v: 1,
        note: 'First Draft',
        timestamp: '2026-04-16T12:00:00Z',
        author: 'Priya Mehra',
        blocks: [
          { id: 'q1', section: 'Abstract', text: 'Lovely Professional University spans hundreds of acres and houses tens of thousands of scholars, making it one of the largest residential universities in the country. Maintaining energy efficiency at this immense scale presents a distinct logistical and environmental challenge.' },
          { id: 'q2', section: 'Technical Implementation', text: 'To counter rising energy demands, the university operations team rolled out Phase II of the Green Campus Initiative. By scaling the rooftop solar installations across the main academic blocks and student hostels, the university has integrated an additional 5MW of clean solar energy into the localized smart-grid.' },
          { id: 'q3', section: 'Sustainability Metrics', text: 'Preliminary data from the smart grid monitors indicate a massive shift in load distribution. The university has successfully reduced its reliance on the state power grid during peak afternoon hours, consequently reducing its localized carbon footprint by a projected 22% over the last fiscal year alone.' },
          { id: 'q4', section: 'Conclusion', text: 'This ambitious initiative not only advances campus sustainability and reduces net operational costs but also serves as a living laboratory. Electrical engineering and environmental science students now have unprecedented access to study industrial-scale renewable grid management in real-time, right in their backyard.' }
        ]
      }
    ],
    rubric: { rigor: 7.5, originality: 8.5, formatting: 8.0 },
    integrity: { plagiarism: 5, aiRisk: 'Medium' },
    facultyFeedback: 'A solid initial draft. The metrics are strong, but the integration with the curriculum requires theoretical backing before final submission.',
    comments: [
      {
        id: 'c3',
        blockId: 'q3',
        author: reviewers.mentor,
        text: "Can you provide a source for the 22% footprint reduction figure? It is crucial to cite the official LPU Sustainability Report here for academic rigor.",
        resolved: false,
        timestamp: '2026-04-17T09:00:00Z',
        replies: [
          {
            id: 'r2',
            author: mockUser,
            text: 'I will definitely pull the exact reference from the annual campus review and include it as a footnote.',
            timestamp: '2026-04-18T11:20:00Z'
          }
        ]
      },
      {
        id: 'c5',
        blockId: 'q4',
        author: reviewers.peer,
        text: "I love the point about the campus acting as a living laboratory! Could we possibly mention how the specific Solar Energy Lab in Block 28 integrates live data from this grid into their coursework?",
        resolved: false,
        timestamp: '2026-04-18T10:15:00Z',
        replies: []
      }
    ]
  },
  {
    id: 'd3',
    title: 'Modernizing Learning Ecosystems: The Block 32 Architecture Review',
    author: 'Kabir Singh',
    status: 'revised',
    currentVersion: 3,
    versions: [
      {
        v: 1,
        note: 'First Draft',
        timestamp: '2026-03-20T09:00:00Z',
        author: 'Kabir Singh',
        blocks: [ { id: 'p1', section: 'Introduction', text: 'The new design for Block 32 brings a lot of natural light.' } ]
      },
      {
        v: 2,
        note: 'Added more student survey data',
        timestamp: '2026-04-01T11:00:00Z',
        author: 'Kabir Singh',
        blocks: [ { id: 'p1', section: 'Introduction', text: 'The new structural design for Block 32 integrates passive cooling and introduces significant natural sunlight.' } ]
      },
      {
        v: 3,
        note: 'Refined conclusion and added methodology',
        timestamp: '2026-04-10T16:30:00Z',
        author: 'Kabir Singh',
        blocks: [
          { id: 'p1', section: 'Introduction', text: 'The recent architectural renovation of Academic Block 32 at Lovely Professional University (LPU) represents a paradigm shift in how learning spaces are structured on modern university campuses. Transitioning away from traditional, isolated classrooms that limit visual and academic interaction, the new design embraces open-concept pedagogy. This radical reimagining was informed by extensive behavioral studies suggesting that physical space deeply dictates student psychology, motivation, and interactive willingness.' },
          { id: 'p2', section: 'Design Philosophy', text: 'By replacing restrictive concrete walls with double-glazed acoustic glass partitions and integrating centralized atrium gardens, the design actively fosters spontaneous peer-to-peer collaboration. Furthermore, the strategic alignment of the building utilizes passive solar shading to maintain cross-ventilation, significantly enhancing overall student wellness and reducing HVAC load.' },
          { id: 'p3', section: 'Student Metrics & Feedback', text: 'To quantify the impact of this new architecture, a longitudinal survey was conducted. Data collected over a single academic semester from 500+ architecture, engineering, and management students confirms highly positive outcomes.' },
          { id: 'p4', section: 'Student Metrics & Feedback', text: 'Specifically, the open-floor pedagogy format and the abundance of natural light have been credited with improving systemic concentration levels by nearly 18% during traditionally lethargic afternoon sessions.' },
          { id: 'p5', section: 'Conclusion', text: 'Block 32 sets a definitive benchmark for future campus development at LPU. Its success proves that the physical environment is an active participant in the educational process, not merely a passive container.' }
        ]
      }
    ],
    rubric: { rigor: 9.5, originality: 9.5, formatting: 10.0 },
    integrity: { plagiarism: 1, aiRisk: 'Low' },
    facultyFeedback: 'Excellent deployment of statistical surveys to back architectural theory. This meets the criteria for highest honors.',
    comments: [
      {
        id: 'c4',
        blockId: 'p3',
        author: reviewers.mentor,
        text: 'Excellent use of the student survey metrics here. It validates the subjective design claims very nicely with hard quantitative data.',
        resolved: true,
        timestamp: '2026-04-11T10:15:00Z',
        replies: []
      },
      {
        id: 'c6',
        blockId: 'p2',
        author: reviewers.peer,
        text: 'The glass partitions are great for collaboration visually, but do they cause any noise disturbance during simultaneous lectures or exams?',
        resolved: false,
        timestamp: '2026-04-12T14:45:00Z',
        replies: [
          {
            id: 'r3',
            author: mockUser,
            text: 'Actually, the partitions use double-glazed acoustic glass, which reduces sound bleed by 40dB. I completely forgot to specify the acoustic modeling. I should definitely add a line explaining that!',
            timestamp: '2026-04-13T08:30:00Z'
          }
        ]
      }
    ]
  }
];
