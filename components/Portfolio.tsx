import {useStore} from '../util/store';
import React, {useEffect, useState} from 'react';
import {CandidateEntity} from '../util/DatabaseService';
import {Title} from './Title';

export function Portfolio({onSelect}: { onSelect: (id: string) => any }) {
  const [allCandidates, user] = useStore(state => [state.candidates, state.user]);
  const [expanded, setExpanded] = useState(false);
  const [candidates, setCandidates] = useState([]);
  
  useEffect(() => {
    setCandidates(Object.entries(user?.stocks ?? {})
      .filter(([, amount]) => amount)
      .sort((a, b) => b[1] - a[1])
      .map(([candidateId, amount]) => ({
        candidate: allCandidates.find(candidate => candidate._id === candidateId) as CandidateEntity,
        amount
      }))
      .filter(({candidate}) => !candidate.terminated)
    );
  }, [user, allCandidates]);

  return <div className={candidates.length === 0 ? 'hidden' : ''}>
    <Title>Portfolio</Title>
    <div style={{maxHeight: expanded ? 2000 : 200}} className="overflow-hidden flex flex-wrap">{
      candidates.map(({candidate, amount}) =>
        <div key={candidate._id} className="flex items-center cursor-pointer rounded mb-2 w-full md:w-1/3"
             onClick={() => onSelect(candidate._id)}>
          <div className="text-3xl p-3 pr-4 w-16 text-right bg-gray-200 rounded-l h-full">{amount}</div>
          <div style={{backgroundImage: `url(${candidate.imageUrl})`, backgroundSize: 'cover'}}
               className="w-14 h-14 rounded flex-grow-0 flex-shrink-0"/>
          <div className="text-lg p-2 pl-2 font-serif">{candidate.name}</div>
        </div>)}
    </div>
    <div className="justify-center" style={{display: candidates.length > 9 ? 'flex' : 'none'}}>
      <div
        className="flex justify-center items-center text-white rounded-3xl w-10 h-10 bg-pohutukawa-400 cursor-pointer"
        onClick={() => setExpanded(f => !f)}>
        <div
          className="border-b-2 border-r-2 border-white w-3 h-3 transform -mt-1"
          style={{transform: `rotate(${expanded ? 225 : 45}deg)`, marginTop: expanded ? 4 : -4}}
        />
      </div>
    </div>
  </div>;
}
