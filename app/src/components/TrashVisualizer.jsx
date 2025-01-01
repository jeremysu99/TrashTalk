import React, {useState, useEffect} from "react";
import "./TrashVisualizer.css";
import trashProgress from './trashProgress.png'

const TrashVisualizer = ({ trashLevel, trashWeight }) => {
    const [animatedFullness, setAnimatedFullness] = useState(0);
    const fullnessPercentage = Math.max(0, ((1000 - trashLevel) / 1000) * 100); // Assuming 1000mm as "full"
    const weightWarning = trashWeight > 10; // Adjust this threshold as needed
    
    useEffect(() => {
        // Trigger the animation effect when the component mounts
        setAnimatedFullness(fullnessPercentage);
    }, [fullnessPercentage]);

    return (
        <div className="trash-visualizer">
            <div
                className="relative mt-10 w-40 h-60"
            >
                {/* Progress Bar */}
                <div
                className="trash-progress-bar"
                style={{
                    height: `${animatedFullness}%`, // Dynamic height based on trashLevel
                }}
                ></div>
                <img
                    src={trashProgress}
                    alt="Trash Can"
                    className="trash-can"
                />
            </div>
            <div className="trash-info">
                <p className="syne-trash mt-8">Trash Level: {1000 - trashLevel} mm (max. 800 mm)</p>
                <p className="syne-trash">Trash Weight: {trashWeight} lbs</p>
                {weightWarning && <p className="warning mt-8">Weight exceeds safe limit!</p>}
            </div>
        </div>
    );
};

export default TrashVisualizer;