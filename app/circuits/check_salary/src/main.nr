fn main(salary: [u32; 3], threshold: pub u32) {
    for i in 0..salary.len() {
        assert(salary[i] > threshold);
    }
}

#[test]
fn test_main() {
    let threshold = 1000;
    let salary = [1200, 1500, 1100];
    main(salary, threshold);
}
