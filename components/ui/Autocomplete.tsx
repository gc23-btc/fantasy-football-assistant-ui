import React, { useState, useEffect, useRef } from 'react';
import { ESPNPlayer } from '@/types';

interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  options: ESPNPlayer[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (player: ESPNPlayer) => void;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  placeholder = 'Search players...',
  options,
  value,
  onChange,
  onSelect,
  error,
  fullWidth = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(player =>
    player.fullName.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 10); // Limit to 10 results

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(newValue.length > 0);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (player: ESPNPlayer) => {
    onSelect(player);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const baseClasses = 'p-2 rounded bg-gray-700 text-white placeholder-gray-400 border focus:outline-none focus:ring-2 focus:ring-blue-500';
  const errorClasses = error ? 'border-red-500' : 'border-gray-600';
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300 mb-1 block">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${widthClass} ${disabledClass}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((player, index) => (
            <div
              key={player.id}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-600 transition-colors ${
                index === highlightedIndex ? 'bg-gray-600' : ''
              }`}
              onClick={() => handleSelect(player)}
            >
              <div className="text-white font-medium">{player.fullName}</div>
              <div className="text-sm text-gray-400">
                Position: {getPositionName(player.defaultPositionId)} | 
                Team: {player.proTeamId || 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to convert position ID to name
function getPositionName(positionId: number): string {
  const positions: Record<number, string> = {
    1: 'QB',
    2: 'RB',
    3: 'WR',
    4: 'TE',
    5: 'K',
    16: 'D/ST',
  };
  return positions[positionId] || 'Unknown';
}
