import React from "react";

interface InstructionsProps {
  currentPose: string;
  instructions: Record<string, string[]>;
}


const Instructions: React.FC<InstructionsProps> = ({ currentPose, instructions }) => {
  if (!instructions[currentPose]) return null;
  return (
    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
      {instructions[currentPose].map((instruction, idx) => (
        <li key={idx} className="instruction" style={{ marginBottom: '12px', fontSize: '1rem', color: '#222' }}>{instruction}</li>
      ))}
    </ul>
  );
};

export default Instructions;
