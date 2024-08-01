fn main(country: u16, restricted_countries: pub [u16; 5]) {
    for i in 0..restricted_countries.len() {
        assert(country != restricted_countries[i]);
    }
}

#[test]
fn test_main() {
    let restricted_countries = [1, 33, 34, 44, 49];
    let country = 971;
    main(country, restricted_countries);
}
