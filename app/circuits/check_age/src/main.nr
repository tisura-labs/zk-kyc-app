fn main(age: u8, threshold: pub u8) {
    assert(age > threshold);
}


#[test]
fn test_main() {
    let threshold = 18;
    let age = 21;
    main(age, threshold);
}
