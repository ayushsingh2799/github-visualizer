import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const {githubRepos}=React.useContext(GithubContext);
  const language=githubRepos.reduce((total,item)=>{
    const {language,stargazers_count}=item;
    if(!language) return total;
    if(!total[language]){
      total[language]={label:language,value:1,star:stargazers_count};
    }
    else{
      total[language]={...total[language],value:total[language].value+1,star:total[language].star+stargazers_count};
    }
    return total;
     
  },{}) // tow parameters 1 callback function and other is value we are going to return{object in this case}
  // basically the first parameter (total) is the object we are returning;
  const mostUsed=Object.values(language).sort((a,b)=>{
    return b.value-a.value;
  }).slice(0,5);

  // most stars per language
  const mostPopular=Object.values(language).sort((a,b)=>{
    return b.star-a.star
  }).map((item)=>{
    return {...item,value:item.star}
  }).slice(0,5);


  // stars, forks functionality for column charts
  let {stars,forks}= githubRepos.reduce((total,item)=>{
     const{stargazers_count,name,forks}=item;
     total.stars[stargazers_count]={label:name,value:stargazers_count};
     total.forks[forks]= {label:name,value:forks};
     return total;
  },{ stars:{},forks:{}});  // here we are returning an object whose properties are also objects

  stars=Object.values(stars).slice(-5).reverse();
  forks=Object.values(forks).slice(-5).reverse();
  
  const chartData = [
    {
      label: "Venezuela",
      value: "290"
    },
    {
      label: "Saudi",
      value: "260"
    },
    {
      label: "Canada",
      value: "180"
    }
   
  ];
  
  return (
     <section className="section">
      <Wrapper className="section-center">
            <Pie3D data={mostUsed}/>
            <Column3D data={stars} />
            <Doughnut2D data={mostPopular}/>
            <Bar3D data={forks} />
            <div></div>
      </Wrapper>
     </section>
  )
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
