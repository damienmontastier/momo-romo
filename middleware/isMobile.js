export default (context) => {
    const { route, redirect } = context
    if(!route.path.includes('/mobile') && context.isMobile) {
        // return redirect('/mobile')
    }
}