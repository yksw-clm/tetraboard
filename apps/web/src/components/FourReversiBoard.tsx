"use client";

import { useEffect, useRef, useState } from "react";

// TODO: いずれは別の場所で定義し、それを利用する
type Cell = "empty" | "black" | "white" | "red" | "blue";
type Board = Cell[][];
type Coordinate = { x: number; y: number };

const BOARD_SIZE = 8;
const CELL_SIZE = 50;
const CANVAS_SIZE = BOARD_SIZE * CELL_SIZE;

const INITIAL_BOARD: Board = [
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "red", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "black", "red", "white", "empty", "empty"],
  ["empty", "empty", "black", "blue", "white", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "blue", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
];

type FourReversiBoardProps = {
  board?: Board;
  playableMoves?: Coordinate[];
  highlightCell?: Coordinate | null;
} & React.HTMLAttributes<HTMLCanvasElement>;

export const FourReversiBoard = ({
  board = INITIAL_BOARD,
  playableMoves = [],
  highlightCell = null,
  onMouseMove,
  onMouseLeave,
  style,
  ...canvasProps
}: FourReversiBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredMove, setHoveredMove] = useState<Coordinate | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // 8x8の盤を描画
    ctx.fillStyle = "forestgreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        ctx.strokeStyle = "black";
        ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // 選択マスを黄色枠でハイライト
    if (highlightCell) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        highlightCell.x * CELL_SIZE + 2,
        highlightCell.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4,
      );
      ctx.lineWidth = 1;
    }

    // 石を描画
    const drawStone = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        x + CELL_SIZE / 2,
        y + CELL_SIZE / 2,
        CELL_SIZE / 2 - 5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    };
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = board[j][i];
        if (cell === "black") drawStone(i * CELL_SIZE, j * CELL_SIZE, "black");
        else if (cell === "white")
          drawStone(i * CELL_SIZE, j * CELL_SIZE, "white");
        else if (cell === "red") drawStone(i * CELL_SIZE, j * CELL_SIZE, "red");
        else if (cell === "blue")
          drawStone(i * CELL_SIZE, j * CELL_SIZE, "blue");
      }
    }

    // 着手可能マス中央に黒丸を描画（ホバー中は強調）
    for (const move of playableMoves) {
      const isHovered = hoveredMove?.x === move.x && hoveredMove?.y === move.y;
      ctx.fillStyle = isHovered ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.arc(
        move.x * CELL_SIZE + CELL_SIZE / 2,
        move.y * CELL_SIZE + CELL_SIZE / 2,
        isHovered ? 7 : 5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }, [board, playableMoves, highlightCell, hoveredMove]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // マス目座標を取得
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    void x;
    void y;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    const nextHovered = playableMoves.find(
      (move) => move.x === x && move.y === y,
    );
    setHoveredMove((prev) => {
      if (!nextHovered && !prev) return prev;
      if (
        nextHovered &&
        prev?.x === nextHovered.x &&
        prev?.y === nextHovered.y
      ) {
        return prev;
      }
      return nextHovered ?? null;
    });

    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setHoveredMove(null);
    onMouseLeave?.(e);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        cursor: hoveredMove ? "pointer" : style?.cursor,
      }}
      {...canvasProps}
    />
  );
};
