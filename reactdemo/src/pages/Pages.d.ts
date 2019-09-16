interface Page {
    global: {
        api: {
            byForm: Function;
            withOptions: Function;
            del: Function;
            get: Function;
            post: Function;
            put: Function;
            request: Function;
        };
        back: Function;
        forward: Function;
        hybrid: Function;
        events: any;
        showError: (message: string) => void;
        toast: (message: string, time: number) => void;
    };
    match: {
        params: any;
    };
    location: any;
}
