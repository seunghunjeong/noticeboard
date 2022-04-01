<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]](https://github.com/seunghunjeong/noticeboard/graphs/contributors)
[![Stargazers][stars-shield]](https://github.com/seunghunjeong/noticeboard/stargazers)


<!-- TABLE OF CONTENTS -->
<details>
  <summary>CONTENTS</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

1. 캘린더에 일일보고서 입력/수정/삭제/조회
2. 게시판 입력/수정/삭제/조회
3. 파일 업로드/다운로드
4. 로그인/회원가입

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.


* [React.js](https://reactjs.org/)
* [Node.js](https://nodejs.org/en/)
* [Ant Design](https://ant.design/)
* [MySql](https://www.mysql.com/)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

![image](https://user-images.githubusercontent.com/59137000/161226501-f4651266-5dfc-4365-8c1c-091bca7b9d84.png)

* CKEditor plugin 설치하기 => etc 폴더에있는 압축파일을 위 경로에 붙여 넣어주세요.
  ```
  ..\noticeboard\client\node_modules@ckeditor\ckeditor5-build-classic
  ```


### Installation

client 와 sever 각각에서 모듈을 다운받아주세요.

1.  cd client로 이동 후 Install NPM packages
    ```sh
    npm i
    ```
    
2. cd server로 이동 후 Install NPM packages
   ```sh
   npm i
   ```

3. `config.env`에 DB정보입력 sever > config > `config.env`
   <br>
   ![image](https://user-images.githubusercontent.com/59137000/161227997-0a137a99-e606-4149-a31d-35a0f521bbaf.png)
   ![image](https://user-images.githubusercontent.com/59137000/161227784-c3083cf0-0ea2-40f4-8de2-d8e0c72140ae.png)
   
   
4. cd server에서 실행
   ```sh
   npm run dev
   ```
   nodemon으로 서버를 구동시키고 있으며 concurrently 라이브러리를 이용해서 sever와 client 동시에 구동시키고 있습니다.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Add log file
- [x] Loin / Sign-up
- [x] Board
    - [x] create
    - [x] read
    - [x] update
    - [x] delete
    - [x] file upload
    - [x] file update
    - [x] file download
- [x] Daily report
   

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact


*seunghoon jung* - [@github](https://github.com/seunghunjeong) - leader 😉

*Kim kyung bin* - [@github](https://github.com/Kim-kyung-bin)

*Park ga youn* - [@github](https://github.com/ga-youn) - gyym9310@gmail.com


Project Link: [https://github.com/seunghunjeong/noticeboard](https://github.com/seunghunjeong/noticeboard)

<p align="right">(<a href="#top">back to top</a>)</p>


