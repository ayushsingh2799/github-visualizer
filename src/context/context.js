import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';
const GithubContext=React.createContext();

const GithubProvider=({children})=>{  // destructuring the obhject itself insted of passing it as prop
    const[githubUser,setGithubUser]=useState(mockUser);
    const[githubFollower,setGithubFollower]=useState(mockFollowers);
    const[githubRepos,setGithubRepos]=useState(mockRepos);
   // request loading
    const[requests, setRequests]=useState(0);
    const[loading,setIsLoading]=useState(false);
    // error
    const [error,setError]=useState({show:false,msg:""});
    const searchGithubUser=async(user)=>{
        toggleError();
        setIsLoading(true);
        const response=await axios(`${rootUrl}/users/${user}`).catch(err=>{console.log(err)});
        if(response){
            setGithubUser(response.data);
            const {login,followers_url} =response.data;
            // repos
            axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response)=>{setGithubRepos(response.data)});

            // followers
            axios(`${followers_url}?per_page=100`).then((response)=>{setGithubFollower(response.data)});
            // repos url
           // https://api.github.com/users/john-smilga/repos?per_page=100

            // followers url
            //https://api.github.com/users/john-smilga/followers


        }
        else{
            toggleError(true,"Invalid User Name");
        }
        checkRequests();
        setIsLoading(false);
    }
    // check rate
    const checkRequests=()=>{
        axios(`${rootUrl}/rate_limit`).then(({data})=>{
           let {rate:{remaining}}=data;
           setRequests(remaining);
           if(remaining===0){
               // throw an error
               toggleError(true,"Sorry You have passed your hourly request limit !");
           }
        }).catch((error)=>{
            console.log(error); 
        })
    }
    function toggleError(show=false,msg=""){
         setError({show,msg});
    }
    //error
    useEffect(checkRequests,[])
    return(
   
        <GithubContext.Provider value={{githubUser,githubFollower,githubRepos,requests,error,searchGithubUser,loading}}>{children}</GithubContext.Provider>
    );
};

export{GithubProvider,GithubContext};

