import React from "react";

export default function Highscore(props) {
  const [sortBy, setSortBy] = React.useState("time");

  const sortedRecords = React.useMemo(() => {
    let records = [...props.record];

    switch (sortBy) {
      case "time":
        return records.sort((a, b) => a.times - b.times);
      case "roll":
        return records.sort((a, b) => a.roll - b.roll);
      case "date":
        return records.sort((a, b) => new Date(b.timeStamps) - new Date(a.timeStamps));
      default:
        return records;
    }
  }, [props.record, sortBy]);

  const limitedRecords = sortedRecords.slice(0, 5);

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 100);
    const millis = milliseconds % 100;

    const formattedSeconds = String(seconds).padStart(2, "0");
    const formattedMilliseconds = String(millis).padStart(2, "0");

    return `00:${formattedSeconds}:${formattedMilliseconds}`;
  }

  return (
    <div className="box">
      <h2>HIGHSCORE</h2>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="time">Time</option>
        <option value="roll">Roll</option>
        <option value="date">Date</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Time</th>
            <th>Roll</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {limitedRecords.map((limRecord, i) => {
            return (
              <tr key={i}>
                <td>{limRecord === props.record[props.record.length - 1] ? "🆕" : i + 1}</td>
                <td>{formatTime(limRecord.times)}</td>
                <td>{limRecord.roll}</td>
                <td>{limRecord.timeStamps}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
