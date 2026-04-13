export const validateContactForm = (body: any) => {
  const errors: string[] = [];

  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!body.name?.trim()) errors.push("Name is required");
  else if (!nameRegex.test(body.name.trim())) {
    errors.push("Name can contain only letters and spaces");
  }

  if (!body.email?.trim()) errors.push("Email is required");
  else if (!emailRegex.test(body.email.trim().toLowerCase())) {
    errors.push("Email must be a valid @gmail.com address");
  }

  if (!body.phone?.trim()) errors.push("Phone is required");
  else if (!phoneRegex.test(String(body.phone).trim())) {
    errors.push("Phone number must be exactly 10 digits and start with 6-9");
  }

  if (!body.message?.trim()) errors.push("Message is required");
  else if (body.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  if (body.subject && body.subject.trim().length > 100) {
    errors.push("Subject must be under 100 characters");
  }

  return errors;
};