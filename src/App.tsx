import { useEffect, useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';
import { Attributes, Class } from './types';

function App() {
  const [attributes, setAttributes] = useState<Attributes>(
    ATTRIBUTE_LIST.reduce((acc, attr) => ({ ...acc, [attr]: 0 }), {} as Attributes)
  );
  const [selectedClass, setSelectedClass] = useState<{ name: Class; requirements: Attributes } | null>(null);
  const [attributeTotal, setAttributeTotal] = useState<number>(0);
  const [skillPoints, setSkillPoints] = useState<{ [key: string]: number }>(
    SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {} as { [key: string]: number })
  );
  const [availableSkillPoints, setAvailableSkillPoints] = useState<number>(0);

  const calculateModifier = (value: number) => Math.floor((value - 10) / 2);

  const incrementAttribute = (attr: keyof Attributes) => {
    if (attributeTotal >= 70) {
      alert('Total attribute points cannot exceed 70');
      return; 
    }
    setAttributes((prev) => ({
      ...prev,
      [attr]: prev[attr] + 1,
    }));
  };

  const decrementAttribute = (attr: keyof Attributes) => {
    if (attributes[attr] <= 0) return;
    setAttributes((prev) => ({
      ...prev,
      [attr]: prev[attr] - 1,
    }));
  };

  useEffect(() => {
    const total = Object.values(attributes).reduce((acc, value) => acc + value, 0);
    setAttributeTotal(total);
  }, [attributes]);

  useEffect(() => {
    const intelligenceModifier = calculateModifier(attributes.Intelligence);
    setAvailableSkillPoints(Math.max(0, 10 + 4 * intelligenceModifier));
  }, [attributes.Intelligence]);

  const incrementSkill = (skill: string) => {
    if (availableSkillPoints <= 0) {
      alert('No skill points available to allocate');
      return;
    }
    setSkillPoints((prev) => ({
      ...prev,
      [skill]: prev[skill] + 1,
    }));
    setAvailableSkillPoints((prev) => prev - 1);
  };

  const decrementSkill = (skill: string) => {
    if (skillPoints[skill] <= 0) return;
    setSkillPoints((prev) => ({
      ...prev,
      [skill]: prev[skill] - 1,
    }));
    setAvailableSkillPoints((prev) => prev + 1);
  };

  const meetsClassRequirements = (classKey: Class) => {
    const classRequirements = CLASS_LIST[classKey];
    return classRequirements !== undefined && Object.keys(classRequirements).every((attr) => {
      const attribute = attr as keyof Attributes;
      return attributes[attribute] >= classRequirements[attribute];
    });
  };

  const handleClassClick = (classKey: Class) => {
    if (selectedClass?.name === classKey) {
      setSelectedClass(null);
    } else {
      const classRequirements = CLASS_LIST[classKey];
      if (classRequirements) {
        setSelectedClass({
          name: classKey,
          requirements: classRequirements,
        });
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section attribute-list">
        <h2>Attributes</h2>
        {ATTRIBUTE_LIST.map((attr) => (
          <div key={attr}>
            <span>{attr}: {attributes[attr as keyof Attributes]}</span>
            <span> (Modifier: {calculateModifier(attributes[attr as keyof Attributes])})</span>
            <button 
              onClick={() => decrementAttribute(attr as keyof Attributes)} 
              data-testid={`decrement-attr-${attr}`}
            >
              -
            </button>
            <button 
              onClick={() => incrementAttribute(attr as keyof Attributes)} 
              data-testid={`increment-attr-${attr}`}
            >
              +
            </button>
          </div>
        ))}
      </section>
      <section className="App-section class-list">
        <h2>Classes</h2>
        {Object.keys(CLASS_LIST).map((classKey) => {
          const className = classKey as Class;
          const isEligible = meetsClassRequirements(className);
          return (
        <div
          key={className}
          className={`class-item ${isEligible ? 'eligible' : 'ineligible'}`}
          onClick={() => handleClassClick(className)}
        >
          {className}
        </div>
          );
        })}
      </section>
      {selectedClass && (
        <section className="App-section class-details">
          <h2>Class Details</h2>
          <h3>{selectedClass.name}</h3>
            <div className="requirements">
            {Object.entries(selectedClass.requirements).map(([attr, value]) => (
              <div 
              className="requirement-item" 
              data-testid={`requirement-${attr}`} 
              key={attr}
              >
              <strong>{attr}</strong>: {value}
              </div>
            ))}
            </div>
        </section>
      )}
      <section className="App-section skill-list">
        <h2>Skills</h2>
        <p>Available Skill Points: {availableSkillPoints}</p>
        {SKILL_LIST.map((skill) => {
          const modifier = calculateModifier(attributes[skill.attributeModifier as keyof Attributes]);
          const total = skillPoints[skill.name] + modifier;
          return (
            <div key={skill.name}>
              <span>{skill.name} - points: {skillPoints[skill.name]} </span>
              <button data-testid={`decrement-skill-${skill.name}`} onClick={() => decrementSkill(skill.name)}>-</button>
              <button data-testid={`increment-skill-${skill.name}`} onClick={() => incrementSkill(skill.name)}>+</button>
              <span> modifier ({skill.attributeModifier}): {modifier} </span>
              <span> total: {total}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
