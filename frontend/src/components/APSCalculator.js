import React, { useState } from "react";

function APSCalculator() {

const [subjects, setSubjects] = useState([
  { name: "Subject 1", mark: "" },
  { name: "Subject 2", mark: "" },
  { name: "Subject 3", mark: "" },
  { name: "Subject 4", mark: "" },
  { name: "Subject 5", mark: "" },
  { name: "Subject 6", mark: "" }
]);

const calculateAPS = (mark) => {

mark = Number(mark);

if (mark >= 80) return 7;
if (mark >= 70) return 6;
if (mark >= 60) return 5;
if (mark >= 50) return 4;
if (mark >= 40) return 3;
if (mark >= 30) return 2;

return 1;

};

const totalAPS = subjects.reduce((total, sub) => {
return total + calculateAPS(sub.mark);
}, 0);

return (

<div>

<h2>APS Calculator</h2>

{subjects.map((sub, index) => (

<div key={index}>

<input
type="number"
placeholder={sub.name}
value={sub.mark}
onChange={(e) => {

const newSubjects = [...subjects];
newSubjects[index].mark = e.target.value;
setSubjects(newSubjects);

}}
/>

</div>

))}

<h3>Total APS: {totalAPS}</h3>

</div>

);

}

export default APSCalculator;