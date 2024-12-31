import React from "react";
import "./TrashVisualizer.css";
import trashProgress from './trashProgress.png'

const TrashVisualizer = ({ trashLevel, trashWeight }) => {
    const fullnessPercentage = Math.min(100, Math.max(0, ((1000 - trashLevel) / 800) * 100)); // Assuming 1000mm as "full"
    const weightWarning = trashWeight > 10; // Adjust this threshold as needed
    // Calculate the color based on the fullness percentage
    const getColor = (percentage) => {
        const red = Math.min(255, Math.round((percentage / 100) * 255)); // Red increases with fullness
        const green = Math.min(255, Math.round((1 - percentage / 100) * 255)); // Green decreases with fullness
        return `rgb(${red}, ${green}, 0)`; // Gradient effect from green to red
    };
    return (
        <div className="trash-visualizer">
            <div
                className="relative mt-10 w-40 h-60"
            >
                {/* Progress Bar */}
                <div
                className="trash-progress-bar"
                style={{
                    height: `${fullnessPercentage}%`, // Dynamic height based on trashLevel
                }}
                ></div>
                <img
                src={trashProgress}
                alt="Trash Can"
                className="absolute inset-0 w-full h-full object-cover z-10 overflow-hidden"
                />
            </div>
            <div className="trash-info">
                <p className="syne-trash mt-8">Trash Level: {1000 - trashLevel} mm (max. 1000 mm)</p>
                <p className="syne-trash">Trash Weight: {trashWeight} lbs</p>
                {weightWarning && <p className="warning mt-8">Weight exceeds safe limit!</p>}
            </div>
        </div>
    );
};

export default TrashVisualizer;