import React from "react";

const Cell = ({
  value,
  onClick,
  onDoubleClick,
  onRightClick,
  isRevealed,
  isFlagged,
  isMine,
}) => {
  const handleClick = () => {
    onClick();
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    onRightClick();
  };

  let cellContent = "";
  if (isRevealed) {
    cellContent = isMine ? "💣" : value > 0 ? value : "";
  } else if (isFlagged) {
    cellContent = "🚩";
  }

  return (
    <div
      className={`cell ${isRevealed ? "revealed" : ""}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onDoubleClick={onDoubleClick}
    >
      {cellContent}
    </div>
  );
};

export default Cell;
