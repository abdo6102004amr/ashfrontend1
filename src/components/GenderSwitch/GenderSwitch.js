import './GenderSwitch.css';

function GenderSwitch({ selectedGender, onGenderChange }) {
  return (
    <div className="gender-switch">
      <button 
        onClick={() => onGenderChange("women")}
        className={selectedGender === "women" ? "active-btn" : ""}
      >
        Women
      </button>

      <button 
        onClick={() => onGenderChange("men")}
        className={selectedGender === "men" ? "active-btn" : ""}
      >
        Men
      </button>
    </div>
  );
}

export default GenderSwitch;
