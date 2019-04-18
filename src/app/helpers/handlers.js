export default class Handler {
    static queryHandler() {
        return {
            get: (target, name) => {
                if (name === 'offset' || name === 'size' || name === 'page') {
                    target[name] = parseInt(target[name]);
                }

                return name in target ? target[name] : null;
            }
        };
    }
}
