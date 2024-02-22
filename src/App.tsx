import React, { useState, useEffect, useRef } from 'react';
import { generateUserData } from './utils/generateUserData.ts';

export interface UserData {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const regions = ['Poland', 'USA', 'Georgia'];

const App: React.FC = () => {
  const [region, setRegion] = useState(regions[0]);
  const [errorRate, setErrorRate] = useState(0);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<UserData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 20;
  const page = useRef(1);

  useEffect(() => {
    generateData();
  }, [region, errorRate]);

  useEffect(() => {
    setDisplayedUsers(userData.slice(0, pageSize));
  }, [userData]);

  const generateData = () => {
    const newUserData = generateUserData(errorRate / 10, pageSize * page.current);
    setUserData(prevData => [...prevData, ...newUserData]);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(event.target.value);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorRate(Number(event.target.value));
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (!loadingMore && scrollTop + clientHeight >= scrollHeight - 5) {
      setLoadingMore(true);
      page.current++;
      setTimeout(() => {
        setDisplayedUsers(prevUsers => [...prevUsers, ...userData.slice(prevUsers.length, prevUsers.length + pageSize)]);
        setLoadingMore(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore]);

  return (
    <div>
      <label>
        Region:
        <select value={region} onChange={handleRegionChange}>
          {regions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Error Rate:
        <input
          type="range"
          min="0"
          max="10"
          value={errorRate}
          onChange={handleSliderChange}
        />
        {errorRate}
      </label>
      <br />
      <table>
        <thead>
        <tr>
          <th>Index</th>
          <th>Random Identifier</th>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
        </tr>
        </thead>
        <tbody>
        {displayedUsers.map((user, index) => (
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.id.slice(0, 4)}</td>
            <td>{user.name}</td>
            <td>{user.address}</td>
            <td>{user.phone}</td>
          </tr>
        ))}
        </tbody>
      </table>
      {loadingMore && <p>Loading...</p>}
    </div>
  );
};

export default App;
