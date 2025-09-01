export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

export const dataValidators = {
  chatSession: (session: any): ValidationResult => {
    const errors: string[] = [];

    if (!session || typeof session !== 'object') {
      errors.push('Invalid session format');
      return { isValid: false, errors };
    }

    if (!session.id || typeof session.id !== 'string') {
      errors.push('Session ID is required and must be a string');
    }

    if (!session.user_id || typeof session.user_id !== 'string') {
      errors.push('User ID is required and must be a string');
    }

    if (!session.title || typeof session.title !== 'string') {
      errors.push('Session title is required and must be a string');
    }

    if (!session.created_at || isNaN(Date.parse(session.created_at))) {
      errors.push('Created at timestamp is required and must be valid');
    }

    // Ensure last_message_at has a valid value
    if (!session.last_message_at || isNaN(Date.parse(session.last_message_at))) {
      session.last_message_at = session.created_at;
    }

    if (!session.updated_at || isNaN(Date.parse(session.updated_at))) {
      session.updated_at = session.created_at;
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: session
    };
  },

  chatMessage: (message: any): ValidationResult => {
    const errors: string[] = [];

    if (!message || typeof message !== 'object') {
      errors.push('Invalid message format');
      return { isValid: false, errors };
    }

    if (!message.id || typeof message.id !== 'string') {
      errors.push('Message ID is required and must be a string');
    }

    if (!message.session_id || typeof message.session_id !== 'string') {
      errors.push('Session ID is required and must be a string');
    }

    if (!message.user_id || typeof message.user_id !== 'string') {
      errors.push('User ID is required and must be a string');
    }

    if (!message.content || typeof message.content !== 'string') {
      errors.push('Message content is required and must be a string');
    }

    if (typeof message.is_user_message !== 'boolean') {
      errors.push('is_user_message must be a boolean');
    }

    if (!message.created_at || isNaN(Date.parse(message.created_at))) {
      errors.push('Created at timestamp is required and must be valid');
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: message
    };
  },

  validateArray: <T>(
    items: T[],
    validator: (item: T) => ValidationResult
  ): { validItems: T[]; invalidItems: T[]; errors: string[] } => {
    const validItems: T[] = [];
    const invalidItems: T[] = [];
    const allErrors: string[] = [];

    items.forEach((item, index) => {
      const result = validator(item);
      if (result.isValid) {
        validItems.push(result.data || item);
      } else {
        invalidItems.push(item);
        allErrors.push(`Item ${index}: ${result.errors.join(', ')}`);
      }
    });

    return {
      validItems,
      invalidItems,
      errors: allErrors
    };
  }
};

export const sanitizeData = {
  chatSessions: (sessions: any[]): any[] => {
    return sessions.map(session => {
      const result = dataValidators.chatSession(session);
      return result.isValid ? result.data : null;
    }).filter(Boolean);
  },

  chatMessages: (messages: any[]): any[] => {
    return messages.map(message => {
      const result = dataValidators.chatMessage(message);
      return result.isValid ? result.data : null;
    }).filter(Boolean);
  }
};