import React, { useState } from "react";
import { RotateCcw } from "lucide-react";

// Types
type PieceType = "p" | "r" | "n" | "b" | "q" | "k";
type PieceColor = "w" | "b";
type Piece = { type: PieceType; color: PieceColor } | null;
type BoardState = Piece[][];

const INITIAL_BOARD: BoardState = [
  [
    { type: "r", color: "b" },
    { type: "n", color: "b" },
    { type: "b", color: "b" },
    { type: "q", color: "b" },
    { type: "k", color: "b" },
    { type: "b", color: "b" },
    { type: "n", color: "b" },
    { type: "r", color: "b" },
  ],
  Array(8).fill({ type: "p", color: "b" }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: "p", color: "w" }),
  [
    { type: "r", color: "w" },
    { type: "n", color: "w" },
    { type: "b", color: "w" },
    { type: "q", color: "w" },
    { type: "k", color: "w" },
    { type: "b", color: "w" },
    { type: "n", color: "w" },
    { type: "r", color: "w" },
  ],
];

const PIECE_UNICODE: Record<string, string> = {
  wk: "♔",
  wq: "♕",
  wr: "♖",
  wb: "♗",
  wn: "♘",
  wp: "♙",
  bk: "♚",
  bq: "♛",
  br: "♜",
  bb: "♝",
  bn: "♞",
  bp: "♟",
};

export const Chess: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(
    null
  );
  const [turn, setTurn] = useState<PieceColor>("w");

  const handleSquareClick = (r: number, c: number) => {
    if (selected) {
      // Move logic (very basic, no validation)
      if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
      }

      const newBoard = [...board.map((row) => [...row])];
      const piece = newBoard[selected.r][selected.c];

      // Capture or move
      newBoard[r][c] = piece;
      newBoard[selected.r][selected.c] = null;

      setBoard(newBoard);
      setSelected(null);
      setTurn(turn === "w" ? "b" : "w");
    } else {
      // Select logic
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        setSelected({ r, c });
      }
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setTurn("w");
    setSelected(null);
  };

  return (
    <div className="flex h-full w-full bg-[#2e2e2e] text-white overflow-hidden font-sans select-none relative">
      {/* Background with wood texture feel or gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#3E3E42] to-[#1E1E20]" />

      {/* Sidebar / Info Panel */}
      <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col z-10">
        <div className="h-12 flex items-center px-4 border-b border-white/10 font-medium text-sm text-white/90">
          Chess
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Current Turn
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xl shadow-inner ${
                  turn === "w"
                    ? "bg-white text-black"
                    : "bg-black text-white border border-white/20"
                }`}
              >
                {turn === "w" ? "♔" : "♚"}
              </div>
              <span className="text-lg font-medium">
                {turn === "w" ? "White" : "Black"}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              History
            </div>
            <div className="text-sm opacity-60 italic">
              Moves will appear here...
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <button
            onClick={resetGame}
            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <RotateCcw size={16} /> New Game
          </button>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="relative shadow-2xl rounded-lg overflow-hidden border-12 border-[#4a4a4e]">
          <div className="grid grid-cols-8 grid-rows-8 w-[600px] h-[600px]">
            {board.map((row, r) =>
              row.map((piece, c) => {
                const isBlack = (r + c) % 2 === 1;
                const isSelected = selected?.r === r && selected?.c === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`
                      flex items-center justify-center text-5xl cursor-pointer relative
                      ${isBlack ? "bg-[#B58863]" : "bg-[#F0D9B5]"}
                      ${isSelected ? "ring-inset ring-4 ring-blue-500/80" : ""}
                    `}
                  >
                    {/* Coordinate labels */}
                    {c === 0 && (
                      <span
                        className={`absolute left-1 top-1 text-[10px] font-bold ${
                          isBlack ? "text-[#F0D9B5]" : "text-[#B58863]"
                        }`}
                      >
                        {8 - r}
                      </span>
                    )}
                    {r === 7 && (
                      <span
                        className={`absolute right-1 bottom-0.5 text-[10px] font-bold ${
                          isBlack ? "text-[#F0D9B5]" : "text-[#B58863]"
                        }`}
                      >
                        {String.fromCharCode(97 + c)}
                      </span>
                    )}

                    {piece && (
                      <span
                        className={`
                          drop-shadow-md select-none transform transition-transform hover:scale-110
                          ${
                            piece.color === "w"
                              ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
                              : "text-black drop-shadow-[0_2px_3px_rgba(255,255,255,0.3)]"
                          }
                        `}
                      >
                        {PIECE_UNICODE[piece.color + piece.type]}
                      </span>
                    )}

                    {/* Move hint (simple dot if selected and empty) - optional enhancement */}
                    {selected &&
                      !piece &&
                      // Logic to show valid moves would go here
                      null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
