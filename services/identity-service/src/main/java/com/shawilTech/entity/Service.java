@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;
    private Double basePrice;
    private int durationInMinutes;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
