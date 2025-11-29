import React from "react";

interface MoodStickerPickerProps {
    selected: string;
    onSelect: (sticker: string) => void;
}

const MOOD_STICKERS = [
    "😊", "😃", "😄", "😁", "😆",
    "😅", "😂", "🤣", "😇", "🙂",
    "🙃", "😉", "😌", "😍", "🥰",
    "😘", "😗", "😙", "😚", "😋",
    "😛", "😝", "😜", "🤪", "🤨",
    "🧐", "🤓", "😎", "🤩", "🥳",
    "😏", "😒", "😞", "😔", "😟",
    "😕", "🙁", "☹️", "😣", "😖",
    "😫", "😩", "🥺", "😢", "😭",
    "😤", "😠", "😡", "🤬", "🤯",
    "😳", "🥵", "🥶", "😱", "😨",
    "😰", "😥", "😓", "🤗", "🤔",
    "🤭", "🤫", "🤥", "😶", "😐",
    "😑", "😬", "🙄", "😯", "😦",
    "😧", "😮", "😲", "🥱", "😴",
    "🤤", "😪", "😵", "🤐", "🥴",
    "🤢", "🤮", "🤧", "😷", "🤒",
    "🤕", "🤑", "🤠", "😈", "👿",
    "👻", "💀", "☠️", "👽", "👾",
    "🤖", "🎃", "😺", "😸", "😹",
];

export const MoodStickerPicker: React.FC<MoodStickerPickerProps> = ({ selected, onSelect }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Mood Sticker</label>
            <div className="grid grid-cols-10 gap-2 p-4 border border-border rounded-lg bg-muted/20 max-h-48 overflow-y-auto">
                {MOOD_STICKERS.map((sticker) => (
                    <button
                        key={sticker}
                        type="button"
                        onClick={() => onSelect(sticker)}
                        className={`text-2xl p-2 rounded-md transition-all hover:scale-110 hover:bg-muted ${selected === sticker
                                ? "bg-primary/20 ring-2 ring-primary scale-110"
                                : "bg-background"
                            }`}
                        title={sticker}
                    >
                        {sticker}
                    </button>
                ))}
            </div>
        </div>
    );
};
