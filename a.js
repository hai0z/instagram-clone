const wait = (timer) =>
    new Promise((resolve) =>
        setTimeout(() => {
            resolve();
            console.log("done " + timer);
        }, timer)
    );

const hello = async () => {
    await wait(1000);
    await wait(500);
};
hello();

const hello1 = (name) => {
    console.log(`xin chao ${name}`);
    return (age) => {
        console.log(`tuoi cua ban la ${age}`);
    };
};
hello1("Nguyen Van A")(20);
