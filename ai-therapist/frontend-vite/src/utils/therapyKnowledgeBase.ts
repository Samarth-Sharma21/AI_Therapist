// Comprehensive Therapy Knowledge Base
// Based on therapeutic approaches including CBT, DBT, Person-Centered Therapy, and Motivational Interviewing

export interface TherapyResponse {
  id: string;
  triggers: string[]; // Keywords that should trigger this response
  contexts: string[]; // Conversational contexts where this is appropriate
  response: string;
  followUp?: string; // Optional follow-up question
  approach: string; // The therapeutic approach this comes from
  emotionalTone: string; // Emotional tone of the response
}

// Database of therapeutic responses from different therapeutic approaches
export const therapyResponses: TherapyResponse[] = [
  // Depression-related responses
  {
    id: 'depression-1',
    triggers: [
      'sad',
      'depressed',
      'depression',
      'hopeless',
      'no point',
      'pointless',
      'worthless',
    ],
    contexts: ['emotional-support', 'initial-disclosure'],
    response:
      "I hear that you're feeling down right now. Depression can make even small tasks feel overwhelming and cloud our perspective. When did you first notice these feelings beginning?",
    followUp:
      'Have you noticed any patterns to when you feel better versus worse?',
    approach: 'CBT',
    emotionalTone: 'empathetic',
  },
  {
    id: 'depression-2',
    triggers: [
      'sad',
      'depressed',
      'depression',
      'hopeless',
      'no motivation',
      'tired',
    ],
    contexts: ['ongoing-support', 'deepening'],
    response:
      "Depression often affects our energy and motivation. Small steps can be really important when you're feeling this way. Is there anything small that has brought you even a moment of relief recently?",
    followUp:
      'Even noticing those small moments can be a helpful way to begin shifting momentum.',
    approach: 'Behavioral Activation',
    emotionalTone: 'supportive',
  },
  {
    id: 'depression-3',
    triggers: [
      'negative thoughts',
      'hate myself',
      'worthless',
      'failure',
      'never get better',
    ],
    contexts: ['thought-patterns', 'deepening'],
    response:
      'Those negative thoughts can be really painful. In therapy, we often find that depression creates a filter that makes negative thoughts seem more true than they actually are. Would it be helpful to explore some of those thoughts together?',
    approach: 'CBT',
    emotionalTone: 'validating',
  },

  // Anxiety-related responses
  {
    id: 'anxiety-1',
    triggers: [
      'anxious',
      'anxiety',
      'worried',
      'panic',
      'stress',
      'stressed',
      'nervous',
    ],
    contexts: ['emotional-support', 'initial-disclosure'],
    response:
      "It sounds like you're experiencing quite a bit of anxiety. When we're anxious, our body's alarm system is activated, which can be really uncomfortable. What physical sensations are you noticing right now?",
    followUp: 'How has this anxiety been affecting your daily life?',
    approach: 'Somatic Experiencing',
    emotionalTone: 'calming',
  },
  {
    id: 'anxiety-2',
    triggers: [
      'anxious',
      'anxiety',
      'worried',
      'panic',
      'stress',
      'stressed',
      'nervous',
    ],
    contexts: ['coping-strategies', 'skills'],
    response:
      'When anxiety feels overwhelming, grounding techniques can help bring you back to the present moment. One approach is the 5-4-3-2-1 technique: notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. Would you like to try this together?',
    approach: 'DBT',
    emotionalTone: 'supportive',
  },
  {
    id: 'anxiety-3',
    triggers: [
      'worry',
      'overthinking',
      'what if',
      'catastrophizing',
      'uncertain',
    ],
    contexts: ['thought-patterns', 'deepening'],
    response:
      'Worry often involves focusing on future uncertainties and assuming the worst outcomes. This is a normal tendency, but can become exhausting. What specific worries have been most present for you lately?',
    followUp:
      'For each worry, we could explore how likely that outcome really is, and what resources you would have if it did happen.',
    approach: 'CBT',
    emotionalTone: 'analytical',
  },

  // Meaning and purpose responses
  {
    id: 'meaning-1',
    triggers: [
      'purpose',
      'meaning',
      'meaningless',
      'point',
      'pointless',
      'fulfillment',
    ],
    contexts: ['existential', 'initial-disclosure'],
    response:
      "Questioning meaning and purpose in life is a deeply human experience. These questions often arise during important transition points or when we're feeling disconnected from what matters. What has prompted these questions for you at this time?",
    followUp: 'When have you felt a sense of meaning or purpose in the past?',
    approach: 'Existential Therapy',
    emotionalTone: 'philosophical',
  },
  {
    id: 'meaning-2',
    triggers: ['purpose', 'meaning', 'meaningless', 'values', 'important'],
    contexts: ['values-exploration', 'deepening'],
    response:
      "Finding meaning often starts with connecting to our core values - what's most important to us. If you were living fully aligned with your values, what might that look like? What qualities would be present in your life?",
    approach: 'ACT',
    emotionalTone: 'curious',
  },
  {
    id: 'meaning-3',
    triggers: [
      'contribute',
      'help others',
      'make a difference',
      'legacy',
      'impact',
    ],
    contexts: ['meaning-making', 'action-oriented'],
    response:
      'Many people find meaning through the impact they have on others or contributing to something larger than themselves. Have there been times when you felt your actions made a positive difference, however small?',
    followUp:
      'Those moments can sometimes point us toward what feels meaningful.',
    approach: 'Logotherapy',
    emotionalTone: 'encouraging',
  },

  // Relationship-focused responses
  {
    id: 'relationships-1',
    triggers: [
      'relationship',
      'partner',
      'spouse',
      'boyfriend',
      'girlfriend',
      'marriage',
    ],
    contexts: ['relationship-issues', 'initial-disclosure'],
    response:
      'Relationships can be both our greatest source of connection and also challenging at times. What aspects of this relationship have been most difficult recently?',
    followUp: 'And what parts of the relationship do you value or appreciate?',
    approach: 'Emotionally Focused Therapy',
    emotionalTone: 'balanced',
  },
  {
    id: 'relationships-2',
    triggers: [
      'argument',
      'fight',
      'conflict',
      'communication',
      'misunderstanding',
    ],
    contexts: ['relationship-issues', 'skills'],
    response:
      "Conflict in relationships often happens when we feel our needs aren't being understood or met. Have you been able to express your needs clearly in this situation? Sometimes using 'I' statements rather than 'you' statements can help reduce defensiveness.",
    approach: 'Communication Skills Training',
    emotionalTone: 'instructive',
  },
  {
    id: 'relationships-3',
    triggers: ['lonely', 'alone', 'isolated', 'disconnected', 'no friends'],
    contexts: ['loneliness', 'emotional-support'],
    response:
      "Feeling disconnected from others can be really painful. We're social beings who need connection. Has this feeling of loneliness been present for a while, or is it more recent?",
    followUp:
      'What types of connections would feel most meaningful to you right now?',
    approach: 'Interpersonal Therapy',
    emotionalTone: 'compassionate',
  },

  // Trauma-related responses
  {
    id: 'trauma-1',
    triggers: ['trauma', 'traumatic', 'abuse', 'assault', 'accident', 'ptsd'],
    contexts: ['trauma-disclosure', 'safety'],
    response:
      'Thank you for sharing something so difficult. First, I want to acknowledge your courage in speaking about this. Trauma can affect us in many ways, and healing is possible, though it takes time. How have you been coping with these experiences?',
    approach: 'Trauma-Informed Care',
    emotionalTone: 'gentle',
  },
  {
    id: 'trauma-2',
    triggers: ['flashback', 'nightmare', 'triggered', 'memory', 'remind'],
    contexts: ['trauma-symptoms', 'coping-strategies'],
    response:
      "Flashbacks and intrusive memories are common responses to trauma. When these occur, grounding techniques can help remind your nervous system that you're here in the present, where you're safe. Would it be helpful to discuss some grounding strategies?",
    approach: 'PTSD Treatment',
    emotionalTone: 'supportive',
  },

  // Self-esteem and self-criticism
  {
    id: 'self-esteem-1',
    triggers: [
      'hate myself',
      'self-loathing',
      'ugly',
      'stupid',
      'worthless',
      'not good enough',
    ],
    contexts: ['self-criticism', 'emotional-support'],
    response:
      "I'm hearing a lot of harsh self-criticism. These thoughts sound really painful. Often, we speak to ourselves in ways we would never speak to someone else we care about. What might you say to a friend who was feeling this way about themselves?",
    approach: 'Self-Compassion Training',
    emotionalTone: 'kind',
  },
  {
    id: 'self-esteem-2',
    triggers: ['confidence', 'insecure', 'inadequate', 'compare', 'imposter'],
    contexts: ['self-worth', 'deepening'],
    response:
      'Many people struggle with feelings of inadequacy or comparing themselves to others. These feelings are common, but can be painful. Where do you think these expectations you have for yourself originated?',
    followUp: 'Are these expectations realistic or fair to hold yourself to?',
    approach: 'Schema Therapy',
    emotionalTone: 'curious',
  },

  // General therapeutic responses
  {
    id: 'general-1',
    triggers: ['help', 'dont know what to do', 'stuck', 'confused', 'lost'],
    contexts: ['seeking-direction', 'initial-contact'],
    response:
      "It can be really difficult when you're feeling stuck or unsure of the path forward. To help me understand better, could you share a bit more about what's been going on that's led you to feeling this way?",
    approach: 'Person-Centered',
    emotionalTone: 'curious',
  },
  {
    id: 'general-2',
    triggers: ['want to talk', 'need to talk', 'just talk', 'listen'],
    contexts: ['seeking-connection', 'initial-contact'],
    response:
      "I'm here to listen. Sometimes just putting our experiences into words can help us process them. What would feel most helpful to talk about today?",
    approach: 'Person-Centered',
    emotionalTone: 'open',
  },
  {
    id: 'general-3',
    triggers: ['overwhelmed', 'too much', 'cant handle', 'breaking point'],
    contexts: ['crisis', 'emotional-support'],
    response:
      "When we're feeling overwhelmed, it can be helpful to focus on just the next step rather than everything at once. Right now, what's one small thing that might help you feel even slightly more grounded?",
    approach: 'Crisis Intervention',
    emotionalTone: 'stabilizing',
  },
  {
    id: 'general-4',
    triggers: ['change', 'different', 'better', 'improve', 'fix'],
    contexts: ['goal-setting', 'action-oriented'],
    response:
      "It sounds like you're wanting to make some changes. If things were better, what would be different? How would you know things were improving?",
    approach: 'Solution-Focused Therapy',
    emotionalTone: 'encouraging',
  },
  {
    id: 'general-5',
    triggers: [
      'why do I feel',
      'understand myself',
      'pattern',
      'keep happening',
    ],
    contexts: ['insight-seeking', 'patterns'],
    response:
      "I appreciate your self-awareness and desire to understand these patterns. Our reactions often have roots in earlier experiences. Have you noticed any similarities between these situations and experiences you've had in the past?",
    approach: 'Psychodynamic',
    emotionalTone: 'reflective',
  },
  {
    id: 'sad-1',
    triggers: ['sad', 'feeling down', 'upset', 'unhappy'],
    contexts: ['emotional-support', 'initial-disclosure'],
    response:
      "I'm sorry to hear you're feeling sad right now. These emotions can be really difficult to sit with. Would you like to tell me more about what's contributing to these feelings?",
    approach: 'Person-Centered',
    emotionalTone: 'empathetic',
  },
];

// Greeting responses for starting conversations
export const greetingResponses = [
  "Hi there. I'm here to support you today. What's been on your mind?",
  "Hello. I'm here to listen and talk with you. How are you feeling today?",
  "Welcome. This is a space where you can share what's going on for you. What brings you here?",
  "I'm here to offer support and listen. What would you like to talk about today?",
  "Hi. I'm here to chat about whatever's important to you right now. How are you feeling?",
];

// Follow-up questions to maintain conversation flow
export const followUpQuestions = [
  'Could you tell me more about that?',
  'How did that make you feel?',
  'What was that experience like for you?',
  'Have you noticed any patterns related to this?',
  'What do you think contributed to that?',
  'What meaning does this have for you?',
  'How have you been coping with this?',
  'What would be helpful for you right now?',
  'What would you like to be different?',
  "What's been most challenging about this situation?",
  'What thoughts come up for you when you experience this?',
  'What has helped you get through difficult times in the past?',
];

// Validation responses to acknowledge feelings
export const validationResponses = [
  'That sounds really difficult.',
  "I can understand why you'd feel that way.",
  "It makes sense that you'd be feeling this way given what you've described.",
  "That's a lot to deal with.",
  'I appreciate you sharing something so personal.',
  'Those feelings are completely valid.',
  "It's understandable to have those reactions.",
  'That sounds like a challenging situation.',
  'I can hear how painful that is.',
  'Your feelings make a lot of sense in this context.',
];

// Transition phrases to combine responses naturally
export const transitionPhrases = [
  'As we talk about this, ',
  "Given what you've shared, ",
  'Considering this situation, ',
  "Based on what you're describing, ",
  'With this in mind, ',
  "Reflecting on what you've shared, ",
  'Taking a step back, ',
  'Looking at the bigger picture, ',
  'From what I understand, ',
  "If I'm hearing you correctly, ",
];

// Closing statement options
export const closingStatements = [
  "I'm here to support you through this.",
  "Please feel free to share more whenever you're ready.",
  "I'm listening and here to help.",
  'Thank you for trusting me with this.',
  'I appreciate your openness.',
  "I'm here to continue this conversation whenever you'd like.",
  'Your willingness to explore these feelings shows courage.',
  "I'm here to listen as you work through this.",
];

// Detect conversation context from message content
export const detectContext = (messageContent: string): string[] => {
  const contexts = [];
  const lowercaseMessage = messageContent.toLowerCase();

  // Initial contact contexts
  if (
    lowercaseMessage.includes('hello') ||
    lowercaseMessage.includes('hi ') ||
    lowercaseMessage.includes('hey') ||
    (lowercaseMessage.includes('help') && lowercaseMessage.length < 30)
  ) {
    contexts.push('initial-contact');
  }

  // Emotional contexts
  if (
    lowercaseMessage.includes('sad') ||
    lowercaseMessage.includes('depress') ||
    lowercaseMessage.includes('down') ||
    lowercaseMessage.includes('hopeless')
  ) {
    contexts.push('emotional-support');
    contexts.push('depression');
  }

  if (
    lowercaseMessage.includes('anx') ||
    lowercaseMessage.includes('worr') ||
    lowercaseMessage.includes('stress') ||
    lowercaseMessage.includes('panic')
  ) {
    contexts.push('emotional-support');
    contexts.push('anxiety');
  }

  // Relationship contexts
  if (
    lowercaseMessage.includes('relationship') ||
    lowercaseMessage.includes('partner') ||
    lowercaseMessage.includes('friend') ||
    lowercaseMessage.includes('family') ||
    lowercaseMessage.includes('parent')
  ) {
    contexts.push('relationship-issues');
  }

  // Meaning contexts
  if (
    lowercaseMessage.includes('meaning') ||
    lowercaseMessage.includes('purpose') ||
    lowercaseMessage.includes('point') ||
    lowercaseMessage.includes('why live')
  ) {
    contexts.push('existential');
    contexts.push('meaning-making');
  }

  // Self-esteem contexts
  if (
    lowercaseMessage.includes('hate myself') ||
    lowercaseMessage.includes('worthless') ||
    lowercaseMessage.includes('not good enough') ||
    lowercaseMessage.includes('failure')
  ) {
    contexts.push('self-criticism');
    contexts.push('self-worth');
  }

  // Trauma contexts
  if (
    lowercaseMessage.includes('trauma') ||
    lowercaseMessage.includes('abuse') ||
    lowercaseMessage.includes('assault') ||
    lowercaseMessage.includes('accident')
  ) {
    contexts.push('trauma-disclosure');
    contexts.push('safety');
  }

  // Coping skills contexts
  if (
    lowercaseMessage.includes('cope') ||
    lowercaseMessage.includes('deal with') ||
    lowercaseMessage.includes('handle') ||
    lowercaseMessage.includes('manage')
  ) {
    contexts.push('coping-strategies');
    contexts.push('skills');
  }

  // Insight-seeking contexts
  if (
    lowercaseMessage.includes('why do i') ||
    lowercaseMessage.includes('understand myself') ||
    lowercaseMessage.includes('pattern') ||
    lowercaseMessage.includes('keep happening')
  ) {
    contexts.push('insight-seeking');
    contexts.push('patterns');
  }

  // If no specific context detected, use general
  if (contexts.length === 0) {
    contexts.push('general');
  }

  return contexts;
};

// Find most relevant response from knowledge base
export const findRelevantResponse = (
  messageContent: string,
  previousResponses: string[] = []
): TherapyResponse => {
  const lowercaseMessage = messageContent.toLowerCase();
  const detectedContexts = detectContext(messageContent);

  // Score each potential response for relevance
  const scoredResponses = therapyResponses.map((response) => {
    let score = 0;

    // Check if any triggers match
    for (const trigger of response.triggers) {
      if (lowercaseMessage.includes(trigger.toLowerCase())) {
        score += 10;
      }
    }

    // Check if contexts match
    for (const context of response.contexts) {
      if (detectedContexts.includes(context)) {
        score += 5;
      }
    }

    // Penalize responses that have been used recently
    if (
      previousResponses.some((prev) =>
        prev.includes(response.response.substring(0, 20))
      )
    ) {
      score -= 15;
    }

    return { response, score };
  });

  // Sort by score and get the highest scoring response
  scoredResponses.sort((a, b) => b.score - a.score);

  // If no good match found, use a general response
  if (scoredResponses[0].score <= 0) {
    const generalResponses = therapyResponses.filter(
      (r) =>
        r.contexts.includes('general') ||
        r.contexts.includes('emotional-support')
    );
    return generalResponses[
      Math.floor(Math.random() * generalResponses.length)
    ];
  }

  return scoredResponses[0].response;
};

// Construct a complete therapeutic response with appropriate structure
export const constructTherapeuticResponse = (
  userMessage: string,
  conversationHistory: string[] = []
): string => {
  // Get previous AI responses to avoid repetition
  const previousResponses = conversationHistory
    .filter((msg) => msg.startsWith('AI:'))
    .map((msg) => msg.substring(4).trim());

  // Find the most relevant base response
  const baseResponse = findRelevantResponse(userMessage, previousResponses);

  // Build components for a natural-sounding response
  const components = [];

  // Start with validation if the message has emotional content
  const hasEmotionalContent = userMessage
    .toLowerCase()
    .match(
      /sad|hurt|angry|depress|anxious|worry|stress|overwhelm|lonely|afraid|scared|upset/
    );

  if (hasEmotionalContent) {
    const validation =
      validationResponses[
        Math.floor(Math.random() * validationResponses.length)
      ];
    components.push(validation);
  }

  // Add main response
  components.push(baseResponse.response);

  // Add follow-up if one exists with the response, otherwise sometimes add a general follow-up
  if (baseResponse.followUp) {
    components.push(baseResponse.followUp);
  } else if (Math.random() > 0.5) {
    const followUp =
      followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    components.push(followUp);
  }

  // Add a closing statement for longer responses
  if (components.join(' ').length > 100 && Math.random() > 0.7) {
    const closing =
      closingStatements[Math.floor(Math.random() * closingStatements.length)];
    components.push(closing);
  }

  // Connect components with appropriate transitions for a natural flow
  let response = '';

  for (let i = 0; i < components.length; i++) {
    if (i === 0) {
      response = components[i];
    } else {
      // Sometimes add a transition phrase
      if (Math.random() > 0.5 && i === 1) {
        const transition =
          transitionPhrases[
            Math.floor(Math.random() * transitionPhrases.length)
          ];
        response += ' ' + transition + components[i].toLowerCase();
      } else {
        response += ' ' + components[i];
      }
    }
  }

  return response;
};
