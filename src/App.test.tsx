import App from './App';
import { render, screen, fireEvent } from '@testing-library/react';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';

test('renders React Coding Exercise header', () => {
  render(<App />);
  const linkElement = screen.getByText(/React Coding Exercise/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders each attribute in the list with 0', () => {
  render(<App />);
  ATTRIBUTE_LIST.forEach((attribute) => {
    const attributeElement = screen.getByText(new RegExp(`${attribute}: 0`, 'i'));
    expect(attributeElement).toBeInTheDocument();
  });
});

test('increments and decrements a specific attribute by name', () => {
  render(<App />);
  const attributeName = ATTRIBUTE_LIST[0];
  const incrementButton = screen.getByTestId(`increment-attr-${attributeName}`);
  const decrementButton = screen.getByTestId(`decrement-attr-${attributeName}`);

  // Increment the attribute
  fireEvent.click(incrementButton);
  const incrementedAttribute = screen.getByText(new RegExp(`${attributeName}: 1`, 'i'));
  expect(incrementedAttribute).toBeInTheDocument();

  // Check all other attributes remain unchanged
  ATTRIBUTE_LIST.slice(1).forEach((attr) => {
    const otherAttribute = screen.getByText(new RegExp(`${attr}: 0`, 'i'));
    expect(otherAttribute).toBeInTheDocument();
  });
  
  // Decrement the attribute
  fireEvent.click(decrementButton);
  const decrementedAttribute = screen.getByText(new RegExp(`${attributeName}: 0`, 'i'));
  expect(decrementedAttribute).toBeInTheDocument();

  // Check all other attributes remain unchanged
  ATTRIBUTE_LIST.slice(1).forEach((attr) => {
    const otherAttribute = screen.getByText(new RegExp(`${attr}: 0`, 'i'));
    expect(otherAttribute).toBeInTheDocument();
  });
});

test('does not allow negative attribute values', () => {
  render(<App />);
  const attributeName = ATTRIBUTE_LIST[0];
  const decrementButton = screen.getByTestId(`decrement-attr-${attributeName}`);

  // Decrement the attribute below zero
  fireEvent.click(decrementButton);
  const negativeAttribute = screen.queryByText(new RegExp(`${attributeName}: -1`, 'i'));
  expect(negativeAttribute).not.toBeInTheDocument();
});

test('renders class list', () => {
  render(<App />);
  Object.keys(CLASS_LIST).forEach((classKey) => {
    const classElement = screen.getByText(classKey);
    expect(classElement).toBeInTheDocument();
  });
});

test('displays class requirements when a class is clicked', () => {
  render(<App />);
  const firstClass = Object.keys(CLASS_LIST)[0];
  const classElement = screen.getByText(firstClass);
  fireEvent.click(classElement);
  Object.entries(CLASS_LIST[firstClass]).forEach(([attribute, value]) => {
    const requirementElement = screen.getByTestId(`requirement-${attribute}`);
    expect(requirementElement).toBeInTheDocument();
    expect(requirementElement).toHaveTextContent(`${attribute}: ${value}`);
  });
});

test('hides class requirements when clicked again', () => {
  render(<App />);
  const firstClass = Object.keys(CLASS_LIST)[0];
  const classElement = screen.getByText(firstClass);
  fireEvent.click(classElement);
  fireEvent.click(classElement);
  Object.entries(CLASS_LIST[firstClass]).forEach(([attribute]) => {
    const requirementElement = screen.queryByTestId(`requirement-${attribute}`);
    expect(requirementElement).not.toBeInTheDocument();
  });
});

test('calculates and displays ability modifiers', () => {
  render(<App />);
  const incrementButton = screen.getByTestId(`increment-attr-${ATTRIBUTE_LIST[0]}`);
  fireEvent.click(incrementButton); // Increment attribute to 1
  fireEvent.click(incrementButton); // Increment attribute to 2
  const modifierElement = screen.getByText(/Modifier: -4/i);
  expect(modifierElement).toBeInTheDocument();
});

test('alerts when total attribute points exceed 70', () => {
  window.alert = jest.fn();
  render(<App />);
  const incrementButton = screen.getByTestId(`increment-attr-${ATTRIBUTE_LIST[0]}`);
  for (let i = 0; i < 71; i++) {
    fireEvent.click(incrementButton);
  }
  expect(window.alert).toHaveBeenCalledWith('Total attribute points cannot exceed 70');
  (window.alert as jest.Mock).mockRestore();
});

test('renders skill list with 0 points', () => {
  render(<App />);
  SKILL_LIST.forEach((skill) => {
    const skillElement = screen.getByText(new RegExp(`${skill.name} - points: 0`, 'i'));
    expect(skillElement).toBeInTheDocument();
  });
});

test('displays available skill points', () => {
  render(<App />);
  const availablePointsElement = screen.getByText(/Available Skill Points: 0/i);
  expect(availablePointsElement).toBeInTheDocument();
});

test('increments and decrements available skill points based on intelligence attribute', () => {
  render(<App />);
  const intelligenceAttribute = 'Intelligence'; 
  const incrementAttributeButton = screen.getByTestId(`increment-attr-${intelligenceAttribute}`);
  const decrementAttributeButton = screen.getByTestId(`decrement-attr-${intelligenceAttribute}`);

  for (let i = 0; i < 6; i++) {
    const intelligenceModifier = Math.floor((i + 1 - 10) / 2);
    const availableSkillPoints = Math.max(0, 10 + 4 * intelligenceModifier);
    fireEvent.click(incrementAttributeButton);
    const availablePoints = screen.getByText(new RegExp(`Available Skill Points: ${availableSkillPoints}`, 'i'));
    expect(availablePoints).toBeInTheDocument();
  }

  // Decrement intelligence attribute back to reduce available skill points
  for (let i = 0; i < 5; i++) {
    fireEvent.click(decrementAttributeButton);
  }
  const decrementedPoints = screen.getByText(/Available Skill Points: 0/i);
  expect(decrementedPoints).toBeInTheDocument();
});

test('alerts when no skill points are available to allocate', () => {
  window.alert = jest.fn();
  render(<App />);
  const skillName = SKILL_LIST[0].name;
  const incrementButton = screen.getByTestId(`increment-skill-${skillName}`);

  // Attempt to increment a skill without available points
  fireEvent.click(incrementButton);
  expect(window.alert).toHaveBeenCalledWith('No skill points available to allocate');
  (window.alert as jest.Mock).mockRestore();
}
);  

test('increments and decrements a specific skill by name', () => {
  render(<App />);
  const intelligenceAttribute = 'Intelligence';
  const incrementAttributeButton = screen.getByTestId(`increment-attr-${intelligenceAttribute}`);
  // Increment intelligence attribute to increase available skill points
  for (let i = 0; i < 10; i++) {
    fireEvent.click(incrementAttributeButton);
  }

  const skillName = SKILL_LIST[0].name;
  const incrementButton = screen.getByTestId(`increment-skill-${skillName}`);
  const decrementButton = screen.getByTestId(`decrement-skill-${skillName}`);

  // Increment the skill
  fireEvent.click(incrementButton);
  const incrementedSkill = screen.getByText(new RegExp(`${skillName} - points: 1`, 'i'));
  expect(incrementedSkill).toBeInTheDocument();

  // Check all other skills remain unchanged
  SKILL_LIST.slice(1).forEach((skill) => {
    const otherSkill = screen.getByText(new RegExp(`${skill.name} - points: 0`, 'i'));
    expect(otherSkill).toBeInTheDocument();
  });
  
  // Decrement the skill
  fireEvent.click(decrementButton);
  const decrementedSkill = screen.getByText(new RegExp(`${skillName} - points: 0`, 'i'));
  expect(decrementedSkill).toBeInTheDocument();

  // Check all other skills remain unchanged
  SKILL_LIST.slice(1).forEach((skill) => {
    const otherSkill = screen.getByText(new RegExp(`${skill.name} - points: 0`, 'i'));
    expect(otherSkill).toBeInTheDocument();
  });
}); 

// TODO: Test for total values for each skill (incrementing attribute modifiers)
