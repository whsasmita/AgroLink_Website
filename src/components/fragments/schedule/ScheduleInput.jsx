import React from 'react';

// Opsi Waktu (08:00, 08:30, 09:00)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

const ScheduleInput = ({ day, value, onChange, disabled }) => {
  // Terjemahkan nama hari dari Inggris ke Indonesia
  const dayLabels = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu',
  };

  const isOff = !value;
  const [startTime, endTime] = isOff ? ['09:00', '17:00'] : value.split('-');

  // Tampilkan waktu yang lebih besar dari `startTime`.
  const filteredEndTimeOptions = timeOptions.filter(time => time > startTime);

  const handleToggleOff = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      onChange('');
    } else {
      onChange('09:00-17:00');
    }
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    
    if (newStartTime >= endTime) {

      const newStartTimeIndex = timeOptions.findIndex(time => time === newStartTime);
      const nextAvailableTime = timeOptions[newStartTimeIndex + 1];
      
      if (nextAvailableTime) {
        onChange(`${newStartTime}-${nextAvailableTime}`);
      } else {
        onChange(`${newStartTime}-${newStartTime}`);
      }
    } else {
      onChange(`${newStartTime}-${endTime}`);
    }
  };

  const handleEndTimeChange = (e) => {
    onChange(`${startTime}-${e.target.value}`);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-main_text">
          {dayLabels[day]}
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`off-${day}`}
            checked={isOff}
            onChange={handleToggleOff}
            disabled={disabled}
            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-main_accent focus:ring-main"
          />
          <label htmlFor={`off-${day}`} className="ml-2 text-sm font-medium text-gray-600">
            Libur
          </label>
        </div>
      </div>

      <div className={`flex items-center gap-2 transition-opacity ${isOff ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`}>
        {/* Dropdown Waktu Mulai */}
        <select
          value={startTime}
          onChange={handleStartTimeChange}
          disabled={isOff || disabled}
          className="w-full px-3 py-2 text-sm transition-colors bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
        >

          {timeOptions.slice(0, -1).map(time => (
            <option key={`start-${time}`} value={time}>{time}</option>
          ))}
        </select>

        <span className="text-gray-500">-</span>

        {/* Dropdown Waktu Selesai */}
        <select
          value={endTime}
          onChange={handleEndTimeChange}
          disabled={isOff || disabled}
          className="w-full px-3 py-2 text-sm transition-colors bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
        >

          {filteredEndTimeOptions.map(time => (
            <option key={`end-${time}`} value={time}>{time}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ScheduleInput;