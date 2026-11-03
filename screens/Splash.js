function SplashPage()
{
    useEffect(() => {

        const timer = setTimeout(() => {
            navigation.replace('Login') //Navigate to login page as soon as splash screen ends
        }, 2000); //display splash screen for  second
    })
}