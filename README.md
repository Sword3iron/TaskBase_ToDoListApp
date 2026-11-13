# TaskBase

To Do List - Mobile Application
-----------------------------------------------------------

Requirement: <br>
Software: Android Studio, Expo Go, XAMPP, Visual Studio Code (IDE) <br>
Framework: React-Native <br>
Language: PHP, JavaScript, TypeScript<br>

This is the code repository of TaskBase, a mobile application that desgined to help users to store notes, create tasks, mark calendars and managing activity timetables effeciently. This application provided several features that enable users to keep track of their schedule, reminders, progress and task categorization, all of which are vital for improving balence and well-being in daily life.<br> Features includes calendar viewing, task progress tracking with percentage counter, timeline schedule and the ability to edit or cancel task

Step by step on how to run the code:
1. Download the 'TaskBase_ToDoListApp'.zip folder from GitHub. 
2. Put the .zip folder and extract it in your working environment.
3. Download the required software:
   - XAMPP ("https://www.apachefriends.org/download.html")
   - Expo Go (Google Play Store, IOS store)
   - Node.js ("https://nodejs.org/en/download")
   
4. Inside the 'TaskBase_ToDoListApp', there is a MySQL file ('taskbase.sql') and PHP files ('taskbaseapp_php'). DO NOT DELETE both of them.
5. After downloaded XAMPP, install the software to your backend environment (C:\Xampp)
6. Click inside the folder the XAMPP, you will see 'htdocs' folder, click inside.
7. Copy entire 'taskbaseapp_php' folder and paste into the htdocs folder.
8. Then, open your XAMPP Control Panel, and activate both 'Apache' and 'MySQL' by tapping 'Start' button.
    **NOTE: Depend on your computer environment, you may need to edit your localhost admin port "3306" or "3307". See 'PORT NUMBER' for reference

9. After that, tap the 'Admin' button to open phpMyAdmin page.
10. Inside phpMyAdmin, go to 'import' option on top bar.
11. Drag the MySQL file ('taskbase.sql') to the page, or click on 'choose file' option and browse for 'taskbase.sql' file and select it, it would automatically load the database.
12. Open up your IDE (Visual Studio Code, Atom), and open the 'TaskBase_ToDoListApp' as workspace.
13. Open up terminal and type 'cd..' to your folder location
14. type 'npm install' to start install libraries used in the project.
15. Then, depend on you server, you might want to make modification to make the project work:<br>
    #### IP ADDRESS
    - For some page in 'screen' folder, look at the URL link of this: `http://xxx.xxx.x.xxx/outeralert/{phpFileName}/`
    - change the IP address router 'xxx.xxx.x.xxx' to your current IP address.
    - type 'ipconfig' to know your router.<br>
    #### PORT NUMBER
    - Go to 'Database.db' on your 'outeralert' folder from 'htdocs' (XAMPP)
    - Depend on your configuration, you might want to change the port number ('localhost:3307').
    - View the XAMPP control panel to see your port number.
    - To change the port number, go to the XAMPP control panel and click on 'Config' and tap 'my.ini'.
    - See 'port={localhost number}', change or switch to your current port number. <br><br>
16. After all set up and done, back to the IDE, type at the terminal 'npx expo start'.
17. Open your Expo Go, scan the QR code to bundling the application.
18. You are good to go!