import React from "react";
import "./TrashVisualizer.css";

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
            <div className="trash-can">
                <div className="trash-lid"></div>
                <div
                    className="trash-fill"
                    style={{
                        height: `${fullnessPercentage}%`,
                        backgroundColor: getColor(fullnessPercentage),
                    }}
                ></div>
            </div>
            <div className="trash-info">
                <p>Trash Level: {1000 - trashLevel} mm (max. 1000 mm)</p>
                <p>Trash Weight: {trashWeight} lbs</p>
                {weightWarning && <p className="warning">Weight exceeds safe limit!</p>}
            </div>
        </div>
    );
};

export default TrashVisualizer;
